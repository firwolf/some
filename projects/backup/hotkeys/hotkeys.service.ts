import { Injectable } from '@angular/core';
import 'mousetrap';

import { both, filter, forEach, ifElse, isEmpty, propEq, without } from 'ramda';

import { Observable } from 'rxjs';
import { ApiService, Query } from 'core/api';

import { Hotkey } from './hotkeys.interface';

@Injectable({
  providedIn: 'root',
})
export class HotkeysService {
  hotkeys: Hotkey[] = [];
  paused: Hotkey[] = [];

  private query: Query;

  private mousetrap: MousetrapInstance;

  constructor(apiService: ApiService) {
    this.query = apiService.query('/binomo/private');

    this.mousetrap = new (Mousetrap as any)();
    this.mousetrap.reset();
  }

  toggle(): Observable<any> {
    return this.query('toggle_hotkeys');
  }

  getHotkey(combo?: string | string[], action?: string): Hotkey[] {
    if (!combo) return this.hotkeys;

    return filter(
      ifElse(
        () => !!action,
        both(propEq('combo', combo), propEq('action', action)),
        propEq('combo', combo),
      ),
      this.hotkeys,
    ) as Hotkey[];
  }

  add({ combo, callback, action }: Hotkey): void {
    this.mousetrap.bind(
      combo,
      (event, combo) => callback(event, combo),
      action,
    );

    this.hotkeys.push({ combo, callback, action });
  }

  del(combo: string | string[], action?: string): void {
    const hk = this.getHotkey(combo, action);

    if (!isEmpty(hk)) {
      this.mousetrap.unbind(combo, action);

      this.hotkeys = without(hk, this.hotkeys);
    }
  }

  pause(combo: string | string[], action?: string): void {
    const hk = this.getHotkey(combo, action);

    if (!isEmpty(hk)) {
      this.paused.push(...hk);

      this.del(combo, action);
    }
  }

  unpause(combo: string | string[], action?: string): void {
    const hotkeys = this.getHotkey(combo, action);

    if (!isEmpty(hotkeys)) {
      this.addFromList(hotkeys);
      this.paused = without(hotkeys, this.paused);
    }
  }

  pauseAll(): void {
    this.paused = [...this.hotkeys];

    forEach((hk: Hotkey) => {
        this.del(hk.combo, hk.action);
      },
      this.hotkeys,
    );
  }

  unpauseAll(): void {
    this.addFromList(this.paused);
    this.paused = [];
  }

  private addFromList(list: Hotkey[]): void {
    forEach((hk: Hotkey) => {
      this.add({
        combo: hk.combo,
        callback: hk.callback,
        action: hk.action,
      });
    }, list);
  }
}
