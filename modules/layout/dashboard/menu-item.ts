import { ɵisObservable } from '@angular/core';
import { Observable, of } from 'rxjs';

export class MenuItem {
  badge$: Observable<number>;

  constructor(
    public icon: string,
    public label: string,
    badge: number | Observable<number>,
  ) {
    this.badge$ = ɵisObservable(badge) ? badge : of(badge);
  }
}
