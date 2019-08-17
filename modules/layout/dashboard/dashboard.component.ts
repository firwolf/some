import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { fire, State, StateProp, StreamProp } from '@vision/rx';

import { appDispatcher } from 'core/app.dispatcher';

import { dashboardInited } from '../const';

import { DashboardItem } from './dashboard.interface';
import { dashboardClosed } from './events';

/**
 * Компонент дашборда
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.tpl.pug',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  state = new State({
    items: [] as DashboardItem[],
    selected: null as DashboardItem,
  });

  @StateProp() items: DashboardItem[];
  @StateProp() selected: DashboardItem;

  @StreamProp() items$: Observable<DashboardItem[]>;
  @StreamProp() selected$: Observable<DashboardItem>;

  sub: Subscription = new Subscription();

  ngOnInit(): void {
    fire(dashboardInited, this);
    this.sub.add(appDispatcher.stream(dashboardClosed).subscribe(() => this.reset()));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addItem(item: DashboardItem) {
    this.items = this.items.concat(item);
  }

  select(item: DashboardItem) {
    if (this.isActive(item)) return this.reset();

    this.selected = item;
  }

  isActive(item: DashboardItem) {
    return item == this.selected;
  }

  reset(): void {
    this.state.reset({ items: this.items });
  }
}
