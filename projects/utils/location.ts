import {
  isEmpty, ifElse,
  isNil, is,
  concat, init, reduce,
  keys,
  call, always,
} from 'ramda';

import { stripRight } from './string';

const regSearch = /[?&]?([^=]+)=([^&]*)/g;

/**
 * Если в url есть сведения о номере страницы, то для корректной работы с пагинацией
 * было решено глобально вычитать единицу.
 * @param name искомый query параметр
 * @param url где искать параметр (необязательный, по умолчанию в location.search)
 */
export const getQueryParam = (name: string, url?: string): string => {
  const param = decodeURIComponent((new RegExp(`[?&]${name}=([^&;]+?)(&|#|;|$)`)
    .exec(url || location.search) || [undefined, ''])[1].replace(/\+/g, '%20')) || null;
  return name === 'page' && param
    ? `${+param - 1}`
    : param;
};

export const getQueryParams = (): { [key: string]: string } => {
  const params = {};
  let tokens = [];
  // tslint:disable-next-line
  while (tokens = regSearch.exec(location.search)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
};

export const isIframe = location !== parent.location;

export const queryString = location.search;

export const domain = document.domain;

export const href = location.href;

export const host = location.host;

export const origin = location.origin;

export const referrer = document.referrer;

export const pathname = location.pathname;

export const hash = location.hash.substr(1);

export const redirect = (path: string, params: any = {}) => {
  redirectURL(urlTo(path), params);
};

export const redirectURL = (path: string, params: any = {}) => {
  const parsedUrl = call(url => url.endsWith('&') ? init(url) : url,
    parseParams(params, isEmpty(params) ? '' : /\?/.test(path) ? '&' : '?'),
  );

  location.href = ifElse(
    is(Object),
    always(concat(path, parsedUrl)),
    always(path),
  )(params);
};

export const redirectToNewTab = (url: string = location.href): {
  openFinalUrl: (url: string) => string,
  closeTab: () => void,
} => {
  const tab = window.open(url, '_blank');

  return {
    openFinalUrl: redirectUrl => tab.location.href = redirectUrl,
    closeTab: () => tab.close(),
  };
};

export const parseParams = (params: any = {}, initial: string): string =>
  reduce(
    (res, attrName: string) => !isNil(params[attrName])
      ? `${res}${attrName}=${params[attrName]}&`
      : res,
    initial,
    keys(params),
  );

export const urlTo = (path: string = ''): string =>
  stripRight('/', path);

export const checkCurrentPath = (path: string): boolean =>
  new RegExp(path).test(pathname);

export const pushState = (url: string, title: string): void => {
  let newUrl = url;

  const page = getQueryParam('page', url);

  if (page) newUrl = replaceUrlParam(url, 'page', `${+page + 2}`);
  history.pushState(newUrl, title, newUrl);
};

export const replaceUrlParam = (url: string, paramName: string, paramValue: string): string => {
  const pattern = new RegExp(`(${paramName}=).*?(&|#|$)`);

  if (url.match(pattern)) return url.replace(pattern, `$1${paramValue}$2`);

  url = url.replace(/[?#]$/, '');
  return `${url}${(url.indexOf('?') > 0 ? '&' : '?')}${paramName}=${paramValue}`;
};
