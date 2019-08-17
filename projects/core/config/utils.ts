import { replace, last, init, append } from 'ramda';

import { getCookie, setCookie } from 'utils/index';

declare const process: any;

export const decodeOldCookie = (name: string) => {
  const val = getCookie(name);
  if (!val) return;

  const match = val.split('--');
  if (match.length > 1) {
    setCookie(name, replace(/"/g, '', window.atob(match[0])), {
      path: '/',
      expires: addNYears(100),
    });
  }
};

export const serialize = (obj: { [key: string]: any }): string => {
  const str = [];
  for (const p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
    }
  return str.join('&');
};

export const addNYears = (n: number) => {
  const now = new Date();
  now.setFullYear(now.getFullYear() + n);
  return now;
};

export const modifiedUrl = append(
  last(location.origin.split('.')),
  init(process.env.API_URL.split('.')),
).join('.');
