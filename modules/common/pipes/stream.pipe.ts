import { Pipe, PipeTransform, ɵisObservable, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, switchAll, distinctUntilChanged } from 'rxjs/operators';
import { identity } from 'ramda';

import { Ticker } from 'core/ticker';

@Pipe({
  name: 'stream',
  pure: false,
})
export class StreamPipe implements PipeTransform, OnDestroy {
  private subject = new Subject();
  private source$: Observable<any>;
  private subscription = new Subscription();
  private force = false;

  private value: any;

  constructor(private ticker: Ticker, private ref: ChangeDetectorRef) {
    this.source$ = this.subject.pipe(
      filter(identity),
      filter(ɵisObservable),
      distinctUntilChanged(),
      switchAll(),
      distinctUntilChanged(),
    );

    this.subscription.add(this.source$.subscribe((val: any) => {
      this.subscribe(val);
    }));
  }

  transform(input$: Observable<any>, force = false) {
    this.force = force;
    this.subject.next(input$);

    return this.value;
  }

  ngOnDestroy() {
    this.value = null;
    this.force = false;
    this.subscription.unsubscribe();
  }

  private subscribe(next: any) {
    this.value = next;
    this.force && this.ref.markForCheck();
    this.ticker.tick();
  }
}
