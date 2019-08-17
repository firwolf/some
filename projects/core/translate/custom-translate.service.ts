import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

const localeMap: Map<string, string> = new Map([
  ['vn', 'vi'],
  ['cn', 'zh-CN'],
  ['ua', 'uk'],
  ['in', 'hi'],
  ['kz', 'kk'],
  ['me', 'sr'],
  ['kr', 'ko'],
]);


export class CustomTranslateService extends TranslateService {
  private locale: string;

  get icuLocale(): string {
    return this.locale;
  }

  use(lang: string): Observable<any> {
    this.locale = localeMap.get(lang) || lang;
    return super.use(lang);
  }
}
