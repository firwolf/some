import { PipeTransform, Pipe, Inject, LOCALE_ID, ChangeDetectorRef } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { Subject, Subscription, combineLatest } from 'rxjs';
import { map, filter, distinctUntilChanged, tap } from 'rxjs/operators';
import { is, isNil } from 'ramda';
import { isNotNil } from 'utils';
import { Currency } from 'core/currency';
import { Ticker } from 'core/ticker';

type DisplayType = 'code' | 'wide' | 'narrow';
const defaultDisplay = 'narrow';

@Pipe({ name: 'currency' })
export class CurrencyPipe implements PipeTransform  {
  constructor(private currency: Currency, @Inject(LOCALE_ID) private locale: string) {}

  transform(
    value: number | string | object,
    code?: string,
    digitsInfo?: string,
    display: DisplayType = defaultDisplay,
  ) {
    const currencyCode = code || this.currency.get();
    const currencySymbol = display == 'code' ?
      currencyCode : getCurrencySymbol(currencyCode, display, this.locale);

    const val = is(Object, value) ? value[currencyCode] : value;
    if (isNil(val)) {
      return null;
    }
    const num = Number(val) / 100;

    return formatCurrency(num, this.locale, currencySymbol, currencyCode, digitsInfo);
  }
}

@Pipe({ name: 'currency$', pure: false })
export class CurrencyStreamPipe implements PipeTransform  {
  private subject = new Subject<number | string>();
  private subscription = new Subscription();
  private display: DisplayType = defaultDisplay;
  private digitsInfo: string;

  private value: string;

  constructor(
    private currency: Currency,
    private ticker: Ticker,
    private ref: ChangeDetectorRef,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    const sourceValue$ = this.subject.pipe(
      filter(isNotNil),
      map(x => Number(x) / 100),
      distinctUntilChanged(),
    );

    const sourceSymbol$ = this.currency.current$.pipe(
      distinctUntilChanged(),
      map(code => this.display == 'code' ?
        code : getCurrencySymbol(code, this.display, this.locale)),
      tap(() => this.ref.markForCheck()),
    );

    const sub = combineLatest(sourceValue$, sourceSymbol$).subscribe(([value, symbol]) => {
      const code = this.currency.getCurrent();

      this.subscribe(formatCurrency(value, this.locale, symbol, code, this.digitsInfo));
    });

    this.subscription.add(sub);
  }

  transform(value: number | string, digitsInfo?: string, display: DisplayType = defaultDisplay) {
    this.display = display;
    this.digitsInfo = digitsInfo;
    this.subject.next(value);

    return this.value;
  }

  ngOnDestroy() {
    this.value = null;
    this.subscription.unsubscribe();
  }

  private subscribe(next: string) {
    this.value = next;
    this.ticker.tick();
  }
}
