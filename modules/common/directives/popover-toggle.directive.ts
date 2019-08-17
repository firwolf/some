import {
  Directive, Input, OnInit, OnDestroy, ElementRef, Output, EventEmitter,
  TemplateRef, ViewContainerRef,
} from '@angular/core';

import { Subscription, fromEvent, NEVER, Observable, merge, partition } from 'rxjs';
import { tap, distinctUntilChanged, filter, switchMap, skip } from 'rxjs/operators';

import { prop } from 'ramda';
import { Ticker } from 'core/ticker';

import { State, StateProp, StreamProp } from '@vision/rx';

@Directive({
  selector: '[popover-toggle]',
})
export class PopoverToggleDirective implements OnInit, OnDestroy {
  state: State<{ isOpen: boolean; }> = new State({
    isOpen: false,
  });

  @Input('popover-toggle') popover: TemplateRef<any>;
  @Input('popover-triggers') triggers = 'click:blur';

  @Input('popover-is-open')
  @StateProp()
  isOpen = false;

  @Output('popover-closed')
  popoverClose = new EventEmitter<void>();

  @StreamProp() isOpen$: Observable<boolean>;

  private subEvent: Subscription;
  private vuiPopover: any;
  private position: string;

  constructor(
    private el: ElementRef, private viewContainerRef: ViewContainerRef, private ticker: Ticker,
  ) { }

  ngOnInit() {
    const element = this.el.nativeElement;
    const [openEv, closeEv] = this.triggers.split(':');
    const [isOpen$, isClose$] = partition(this.state.select(prop('isOpen')), Boolean);

    this.subEvent = merge(
      getOpenEvent(element, openEv),
      isOpen$,
    ).pipe(
      tap(() => {
        if (!this.vuiPopover) {
          const viewRef = this.viewContainerRef.createEmbeddedView(this.popover);
          this.vuiPopover = viewRef.rootNodes[0];
          this.position = this.vuiPopover.getAttribute('position');
          viewRef.markForCheck();
        }
        this.vuiPopover.setAttribute('position', 0);
        this.vuiPopover.toggle().then(() => {
          setTimeout(() => {
            this.vuiPopover.setAttribute('position', this.position);
          }, 25);
        });
        this.ticker.tick();
      }),
      switchMap(() =>
        merge(
          this.getCloseEvent(this.vuiPopover, closeEv),
          isClose$.pipe(skip(1)),
        ).pipe(
          tap(() => {
            this.vuiPopover.close();
            this.popoverClose.emit();
          }),
        ),
      ),
      distinctUntilChanged(),
    ).subscribe();
  }

  ngOnDestroy() {
    this.subEvent && this.subEvent.unsubscribe();
  }

  private getCloseEvent(element: HTMLElement, event: string): Observable<Event | never> {
    switch (event) {
      case 'blur':
      case 'outsideClick':
        // @ts-ignore
        return createStreamEvent(document, 'click', element).pipe(
          filter((e: Event) => e && !this.el.nativeElement.contains(e.target as Node)),
        );
      case 'mouseleave':
        return createStreamEvent(this.el.nativeElement, 'mouseleave', element);
      case 'none':
        return NEVER;
    }
  }
}

const getOpenEvent = (element: HTMLElement, event: string): Observable<Event | never> =>
  event === 'none' ? NEVER : fromEvent(element, event);

const createStreamEvent = (
  element: HTMLElement,
  event: string,
  el: HTMLElement,
): Observable<Event> =>
  fromEvent(element, event).pipe(
    filter(e => el && !el.contains(e.target as Node)),
  );
