import { APP_INITIALIZER } from '@angular/core';

import { merge } from 'ramda';

import { appDispatcher } from 'core/app.dispatcher';

import { ConfigService } from './config.service';
import { configInited } from './events';

export let config: any = {};

export const configInitializer = {
  provide: APP_INITIALIZER,
  useFactory: initializer,
  deps: [ConfigService],
  multi: true,
};

export function initializer(api: ConfigService) {
  return () => api.init().then(cfg => {
    config = merge(config, cfg);
    appDispatcher.dispatch(configInited, config);
  });
}
