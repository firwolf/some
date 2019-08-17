import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';

import { test, mapObjIndexed } from 'ramda';

import {
  getQueryParam, getCookie, setCookie, removeCookieAllPaths, hexadecimal,
} from 'utils/index';

import { isProd } from 'shared/const';

import { decodeOldCookie, serialize, addNYears, modifiedUrl } from './utils';

@Injectable()
export class ConfigService {
  private http: HttpClient;

  constructor(handler: HttpBackend, @Inject(LOCALE_ID) private locale: string) {
    this.http = new HttpClient(handler);
  }

  init(): Promise<any> {
    const publicUrl = `${modifiedUrl}/binomo`;
    const mobileUrl = '/api';
    const privateUrl = `${publicUrl}/private`;
    const postfixUrl = `/config?3&${serialize({ locale: this.locale })}`;

    decodeOldCookie('authtoken');
    decodeOldCookie('device_id');

    const queryDeviceId = getQueryParam('device_id');
    queryDeviceId && setCookie('device_id', queryDeviceId, {
      path: '/',
      expires: addNYears(100),
    });

    const queryAuthtoken = getQueryParam('authtoken');
    queryAuthtoken && setCookie('authtoken', queryAuthtoken, {
      path: '/',
      expires: addNYears(100),
    });

    const authtoken = getCookie('authtoken');
    let deviceId = getCookie('device_id');
    const deviceType = getQueryParam('device') || getCookie('device_type') || 'web';

    const isMobileApp = deviceType !== 'web';

    if (!isMobileApp && !test(/^[a-f0-9]{32}$/i, deviceId)) {
      deviceId = hexadecimal(32);
      setCookie('device_id', deviceId, {
        path: '/',
        expires: addNYears(100),
      });
    }

    const headers = {
      'Device-Id': deviceId,
      'Device-Type': deviceType,
    };
    if (authtoken) headers['Authorization-Token'] = authtoken;

    const options = {
      withCredentials: true,
      responseType: 'json',
      headers: new HttpHeaders(headers),
    };

    const fullUrl = isMobileApp
      ? `${mobileUrl}${postfixUrl}&${
          serialize({ authtoken, device: deviceType, device_id: deviceId })
        }`
      : `${authtoken ? privateUrl : publicUrl}${postfixUrl}`;

    return this.load(fullUrl, options);
  }

  private load(url: string, options): Promise<any> {
    const isAllOpen = getCookie('alohomora');

    return this.http.request('GET', url, options).toPromise()
      .then(({ data }: any) => ({
        apiUrl: data.api_url,
        authorized: data.authorized,
        deviceId: data.device_id,
        currencies: data.currencies,
        certificate: data.certificate,
        showTutorial: data.show_tutorial,
        geo: data.geo,
        deviceType: data.device_type,
        captchaSignUp: data.captcha_sign_up && data.geo != 'CN',
        captchaSignIn: data.captcha_sign_in && data.geo != 'CN',
        gaUid: data.ga_uid,
        minDeposit: data.minimal_deposit,
        blockedCountry: data.blocked_country,
        blockingSettings: isAllOpen
          ? mapObjIndexed(() => false, data.blocking_settings)
          : data.blocking_settings,
        websockets: {
          as: `wss://${data.as}`,
          ws: `${isProd ? 'wss' : 'ws'}://${data.ws}`,
        },
      })).catch(() => {
        removeCookieAllPaths('authtoken');
        location.href = '/';
      });
  }
}
