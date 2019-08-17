import { APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { toMessage, toError } from '@vision/rx';
import * as events from './events';

export const translateInitializer = {
  provide: APP_INITIALIZER,
  useFactory: initializer,
  deps: [TranslateService, LOCALE_ID],
  multi: true,
};

export function initializer(api: TranslateService, locale: string) {
  api.addLangs([locale]);
  api.setDefaultLang('en');

  return () => api.use(locale).pipe(
    toMessage(events.translateLoadedSuccess),
    toError(events.translateLoadedFailure),
  ).toPromise();
}
