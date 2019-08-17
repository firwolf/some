import { Directive, OnInit, OnDestroy, ElementRef, Input } from '@angular/core';

import { Subscription, fromEvent } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { pushToDataLayer } from 'utils/misc';

@Directive({
  selector: '[ga-event]',
})
export class GaEventDirective implements OnInit, OnDestroy {
  @Input('ga-event') ga: string;

  private subscription: Subscription = new Subscription();

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    const element = this.el.nativeElement;

    this.subscription.add(
      fromEvent(element, 'click').pipe(
        mapTo(this.ga),
      ).subscribe(pushToDataLayer));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
