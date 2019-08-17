import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

import { fromEvent, Subscription } from 'rxjs';

@Directive({selector: '[infinity-scroll]'})
export class InfinityScrollDirective implements OnInit, OnDestroy {
  @Input('infinity-scroll') callback: (...args) => any;

  eventSub: Subscription = new Subscription();

  constructor(private elRef: ElementRef) { }

  /**
   * 1) Вешаешь директиву на vui-scroll
   * 2) Прокидываешь в нее колбэк с диспатчем события из нужного модуля
   * 3) Слушаешь событие в моделе и пляшешь от радости
   *
   * @example
   * dashboard.addItem({
   *    menu: new MenuItem('капитошка', title, 0),
   *    title: new Breadcrumbs(titles$, () => {
   *      console.log('макарошка')
   *    }),
   *    content: CapitoshkaController,
   *    infinityScroll: () => model.dispatch(loadCapitosh), // callback
   *  });
   */
  ngOnInit()  {
    this.eventSub.add(fromEvent(this.elRef.nativeElement, 'vuiScroll')
      .subscribe(({ detail }) => {
        const checkpoint = detail.scrollHeight * 0.85;
        const scrollMove = detail.clientHeight + detail.scrollTop;

        if (this.callback && scrollMove >= checkpoint) this.callback();
      }),
    );
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }
}
