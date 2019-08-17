import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { ApiModule } from './api';
import { provider as appDispatcherProvider } from './app.dispatcher';
import { ConfigService, configInitializer } from './config';
import { translateInitializer } from './i18n/index';

import { CustomTranslateService } from './translate/custom-translate.service';
import { CountersComponent } from 'core/counters/counters.component';
import { EnvDirective } from './directives/env.directive';
import { GaEventDirective } from './directives/ga-event.directive';

import { WebSocketService } from './websockets';

import { deployUrl } from 'shared/const';

import { Ticker } from './ticker';
import { Currency } from './currency';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new MultiTranslateHttpLoader(httpClient, [
    { prefix: `.${deployUrl}assets/i18n/`, suffix: '.json' },
    { prefix: `.${deployUrl}assets/common-i18n/`, suffix: '.json' },
  ]);
}

@NgModule({
  declarations: [
    EnvDirective,
    GaEventDirective,
    CountersComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ApiModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    TranslateModule,
    ApiModule,
    EnvDirective,
    GaEventDirective,
    CountersComponent,
  ],
  providers: [
    Ticker,
    Currency,
    ConfigService,
    WebSocketService,
    { provide: TranslateService, useClass: CustomTranslateService },
    configInitializer,
    translateInitializer,
    appDispatcherProvider,
    {
      provide: LOCALE_ID,
      useFactory: () => {
        const pathToLocale = location.pathname.match(/^\/([a-z]{2})\//);
        return pathToLocale && pathToLocale[1] || 'en';
      },
    },
  ],
})
export class CoreModule { }
