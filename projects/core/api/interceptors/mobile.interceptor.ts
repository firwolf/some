import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { getQueryParam } from 'utils/location';
import { getCookie } from 'utils/cookies';

/**
 * Грязный костыль для мобильной кассы
 * Выпилить, когда бэкенд соберется с духом и доделает авторизацию для мобилок
 */
@Injectable()
export class MobileInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const update: Parameters<HttpRequest<any>['clone']>[0] = {};

    const deviceType = getQueryParam('device') || getCookie('device_type') || 'web';
    const deviceId = getQueryParam('device_id') || getCookie('device_id');
    const authtoken = getQueryParam('authtoken') || getCookie('authtoken');

    if (/\/binomo\//.test(req.url) && deviceType !== 'web') {
      update.params = req.params
        .append('device', deviceType)
        .append('authtoken', authtoken)
        .append('device_id', deviceId);

      /**
       * @example
       *  https://cash-846-fuckup-api.s.binomo.com/binomo/private/payments/card?locale=en' ->
       *  https://cash-846-fuckup.s.binomo.com/api/payments/card?locale=en
       *
       *  https://api.binomo.com/binomo/private/payments/card?locale=en ->
       *  https://binomo.com/api/payments/card?locale=en
       */
      update.url = req.url.replace(/-?api.(s.)?binomo.com\/binomo(\/private)?/, (_, p1) =>
        (p1 ? '.' + p1 : '') + 'binomo.com/api');
    }

    return next.handle(req.clone(update));
  }
}
