import { Injectable } from '@angular/core';

import { Observable, of, timer } from 'rxjs';
import { distinctUntilChanged, map, pluck, shareReplay, switchMap, take } from 'rxjs/operators';

import { forEach, path, pipe } from 'ramda';

import { action, Effect, ofType, Reaction, Reactive, Reducer, Select, toMessage } from '@vision/rx';

import { appDispatcher } from 'core/app.dispatcher';
import { fetchUserSuccess } from 'shared/profile/profile.events';
import { Hotkey } from 'shared/hotkeys/hotkeys.interface';
import { HotkeysService } from 'shared/hotkeys/hotkeys.service';

import { enableHotkeys, toggleHotkeys } from './hotkeys.events';
import {
  performDeal,
  decrementAmount, incrementAmount,
  decrementTime, incrementTime,
} from '../../trading/app/binary-option-panel/trading-panel.events';

@Reactive({
  state: {
    enabled: false,
  },
  source: appDispatcher,
})
@Injectable()
export class HotkeysModel {
  @Select({ pipe: pipe(distinctUntilChanged(), shareReplay(1)) })
  enabled$: Observable<boolean>;

  constructor(protected service: HotkeysService) { }

  @Reducer({ type: enableHotkeys, prop: 'enabled' })
  toggleHotkeys(_, { payload }) {
    return payload;
  }

  @Effect()
  initHotkeys(events$) {
    return events$.pipe(
      ofType(fetchUserSuccess),
      map(path(['payload', 'hotkeys_enabled'])),
      toMessage(enableHotkeys),
    );
  }

  @Effect()
  toggle(events$) {
    return events$.pipe(
      ofType(toggleHotkeys),
      switchMap(({ payload }) =>
        this.service.toggle().pipe(
          switchMap(() => of(action(enableHotkeys, payload))),
        ),
      ),
    );
  }

  @Reaction()
  setHotkeys(_, state$) {
    return state$.pipe(
      pluck('enabled'),
      distinctUntilChanged(),
    ).subscribe(enabled => {
      if (enabled) {
        const hotkeys: Hotkey[] = [
          {
            combo: ['w', 'ц'],
            callback: () => { this.dispatch(incrementAmount, 1); },
          },
          {
            combo: ['s', 'ы'],
            callback: () => { this.dispatch(decrementAmount, -1); },
          },
          {
            combo: ['e', 'у'],
            callback: () => { this.dispatch(incrementTime, 1); },
          },
          {
            combo: ['d', 'в'],
            callback: () => { this.dispatch(decrementTime, -1); },
          },
          {
            combo: ['q', 'й'],
            callback: e => {
              this.dispatch(performDeal, {
                trusted: e.isTrusted,
                source: 'keyboard',
                trend: 'call',
              });
            },
            action: 'keyup',
          },
          {
            combo: ['r', 'к'],
            callback: e => {
              this.dispatch(performDeal, {
                trusted: e.isTrusted,
                source: 'keyboard',
                trend: 'put',
              });
            },
            action: 'keyup',
          },
          {
            combo: ['ctrl', 'command'],
            callback: () => {
              this.service.pauseAll();
              timer(500).pipe(take(1)).subscribe(() => this.service.unpauseAll());
            },
            action: 'keyup',
          },
        ];

        forEach((hk: Hotkey) => this.service.add({
          combo: hk.combo,
          callback: hk.callback,
          action: hk.action,
        }), hotkeys);
      } else {
        this.service.pauseAll();
      }
    });
  }

  dispatch(type, payload?): void {
    appDispatcher.dispatch(type, payload);
  }
}
