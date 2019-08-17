import { ɵisObservable } from '@angular/core';
import { Observable, of } from 'rxjs';

export class Breadcrumbs {
  items$: Observable<string[]>;

  constructor(title: string | Observable<string[]>, public onBack: (e: any) => void) {
    this.items$ = ɵisObservable(title) ? title : of([title]);
  }
}
