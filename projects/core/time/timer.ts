import { APP_INITIALIZER } from '@angular/core';

import { exhaustMap, take, tap, map } from 'rxjs/operators';
import { toMessage, toError } from '@vision/rx';
import { multiply, compose, prop } from 'ramda';

import { TimeService } from './time.service';
import * as events from './events';

import { appDispatcher } from 'core/app.dispatcher';
import { configInited } from 'core/config';

import { SECOND } from './const';

export const timeInitializer = {
  provide: APP_INITIALIZER,
  useFactory: initializer,
  deps: [TimeService],
  multi: true,
};

export function initializer(api: TimeService) {
  const config$ = appDispatcher.stream(configInited).pipe(take(1));

  return () => config$.pipe(
    exhaustMap(() => api.load().pipe(
      map(compose(multiply(SECOND), prop('time'))),
      tap(time => api.setTime(time)),
      toMessage(events.timeLoadedSuccess),
      toError(events.timeLoadedFailure),
    ))).toPromise();
}
