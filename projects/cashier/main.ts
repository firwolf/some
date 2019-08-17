import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { defineCustomElements, applyPolyfills } from '@vision/ui/dist/loader';
import * as Sentry from '@sentry/browser';

import { env, isProd } from 'shared/const';
import { version } from '../../package.json';

import { AppModule } from './app/app.module';

isProd && enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop' })
  /* tslint:disable-next-line */
  .catch(err => console.log(err));

applyPolyfills().then(() => {
  defineCustomElements(window);
});

isProd && Sentry.init({
  dsn: 'https://053952b0cd934523a68d77c394446aeb@sentry.binomo.com/48',
  release: version,
  environment: env,
});
