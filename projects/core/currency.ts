import { Injectable } from '@angular/core';
import { getCurrencySymbol } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

type CurrencyCode = string;
const defaultCode: CurrencyCode = 'USD';

@Injectable()
export class Currency {
  main$: Observable<CurrencyCode>;
  current$: Observable<CurrencyCode>;

  private main = new BehaviorSubject<CurrencyCode>(defaultCode);
  private current = new BehaviorSubject<CurrencyCode>(defaultCode);

  constructor() {
    this.main$ = this.main.asObservable();
    this.current$ = this.current.asObservable();
  }

  get() {
    return this.main.getValue();
  }

  getSymbol() {
    return getCurrencySymbol(this.get(), 'narrow');
  }

  getCurrent() {
    return this.current.getValue();
  }

  getCurrentSymbol() {
    return getCurrencySymbol(this.getCurrent(), 'narrow');
  }

  set(value: CurrencyCode) {
    this.main.next(value);
    this.current.next(value);
  }

  select(value: CurrencyCode) {
    this.current.next(value);
  }
}
