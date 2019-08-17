import {
  is, reduce, compose, forEach, forEachObjIndexed, merge,
} from 'ramda';

/**
 * Устанавливает печеньки по имени
 * Третьим аргументом передаются дополнительные параметры
 */
export const setCookie = (name: string, val: string, options: { [key: string]: any } = {}) => {
  const value = encodeURIComponent(val);
  let expires = options.expires;
  let updatedCookie = `${name}=${value}`;

  if (is(Number, expires) && expires) {
    const date = new Date();
    // @ts-ignore
    date.setTime(date.getTime() + expires * 1000);
    expires = options.expires = date;
  }

  if (expires && expires.toUTCString) options.expires = expires.toUTCString();

  forEachObjIndexed(
    (val, key) => {
      updatedCookie += `; ${key}`;
      const propValue = val;
      if (propValue !== true) updatedCookie += `=${propValue}`;
    },
    options,
  );

  document.cookie = updatedCookie;
};


/**
 * Забирает значение печеньки по имени
 */
export const getCookie = (name: string): string | undefined => {
  const matches = document.cookie.match(new RegExp(
    `(?:^|; )${name.replace(/([\\.$?*|{}\\(\\)\\[\\]\\\/\+^])/g, '\\$1')}=([^;]*)`,
  ));
  return matches && decodeURIComponent(matches[1]);
};


/**
 * Удаляет печеньку по имени
 * Зачем тут второй параметр с опциями - в душе не канаю
 */
export const removeCookie = (name: string, options: { [key: string]: any } = {}): void => {
  setCookie(name, '', merge({ expires: -1 }, options));
};


/**
 * Удаляет печеньку по имени для всех возможных путей текущего домена
 * Какая-то дичь, если честно!
 */
export const removeCookieAllPaths = (name: string): void => {
  const segments = location.pathname.replace(/\/$/, '').split('/');

  const removeAll = compose(
    forEach((path: string) => removeCookie(name, { path })),
    reduce((acc: string[], item: string) => {
      const path = segments.slice(0, acc.indexOf(item) + 1).join('/');
      return acc.concat([path, `${path}/`]);
    }, []),
  );

  removeAll(segments);
};
