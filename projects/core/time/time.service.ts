import { Injectable } from '@angular/core';

import { PartialObserver, Observable, interval, timer } from 'rxjs';
import { startWith, delayWhen } from 'rxjs/operators';

import { ApiService } from 'core/api';

import { SECOND, MINUTE } from './const';

interface Streams {
  second: Observable<number>;
  minute: Observable<number>;
}

type SubscribeCallback = PartialObserver<number> | ((value: number) => void);
type UnsubscribeCallback = () => void;

@Injectable()
export class TimeService {
  streams: Streams;

  minute$: Observable<number>;

  eachSecond$: Observable<number>;
  eachMinute$: Observable<number>;

  diffTime: number = null;

  constructor(private api: ApiService) {
    this.streams = {
      second: this.createStream(SECOND),
      minute: this.createStream(MINUTE),
    };

    this.minute$ = interval(MINUTE);

    this.eachSecond$ = this.streams.second;
    this.eachMinute$ = this.streams.minute;
  }

  get now(): Date {
    return new Date(this.time);
  }

  get time(): number {
    return Date.now() - this.diffTime;
  }

  load(): Observable<{ time: number }> {
    return this.api.query('/binomo/time')();
  }

  setTime(now: number | string) {
    const serverTime = new Date(now).getTime();
    const clientTime = Date.now();

    this.diffTime = clientTime - serverTime;
  }

  eachSecond(callback: SubscribeCallback): UnsubscribeCallback {
    return this.setCallback('second', callback);
  }

  eachMinute(callback: SubscribeCallback): UnsubscribeCallback {
    return this.setCallback('minute', callback);
  }

  private setCallback(type: string, callback: SubscribeCallback): UnsubscribeCallback {
    const subscription = this.streams[type].subscribe(callback);

    return () => subscription.unsubscribe();
  }

  private createStream(time: number): Observable<number> {
    return interval(time).pipe(
      startWith(0),
      delayWhen(() => timer(time - (this.time % time))),
    );
  }
}
