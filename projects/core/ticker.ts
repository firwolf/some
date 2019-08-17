import { ApplicationRef, Injectable } from '@angular/core';
import { Subject, animationFrameScheduler, from } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { range } from 'ramda';

const framesCount = 2;

@Injectable()
export class Ticker {
  private task = new Subject();
  private task$ = this.task.pipe(exhaustMap(() => from(
    range(0, framesCount), animationFrameScheduler,
  ).toPromise()));

  constructor(private ref: ApplicationRef) {
    this.task$.subscribe(() => {
      this.ref.tick();
    });
  }

  tick() {
    this.task.next();
    return this.task$.pipe(take(1)).toPromise();
  }
}
