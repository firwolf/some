import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Subscription, of, merge } from 'rxjs';
import { filter, mapTo, map, take } from 'rxjs/operators';

import { isNil, complement } from 'ramda';

import { config } from 'core/config';

import { ProfileModel } from 'shared/profile/profile.model';

import { setCookie } from 'utils/cookies';

const scriptsUrls: Script[] = [
  {
    src: 'google-tag-manager.js',
    active: true,
  },
];
const pageType = location.href.split('/').splice(-1).join();

@Component({
  selector: 'app-counters',
  templateUrl: './counters.tpl.pug',
})
export class CountersComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  constructor(
    private elementRef: ElementRef,
    private profileModel: ProfileModel,
    private i18n: TranslateService,
  ) {}

  ngOnInit(): void {
    const config$ = merge(
      this.profileModel.user$.pipe(
        filter(complement(isNil)),
      ),
      of(config.authorized).pipe(filter(complement(Boolean)), mapTo(null)),
    ).pipe(
      take(1),
      map(this.getDataLayerConfig.bind(this)),
    );

    this.subscription.add(
      config$.subscribe((cfg: any) => {
        [{
          name: 'userId',
          data: cfg.uid || '',
        }, {
          name: 'user_language',
          data: this.i18n.currentLang,
        }, {
          name: 'user_timezone',
          data: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }].forEach(({ name, data }) => setCookie(name, data));

        this.addDataLayer([cfg]);

        scriptsUrls.forEach(({ active, src }) => active && import(`./scripts/${src}`));
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private addDataLayer(source: any[]): void {
    const s = document.createElement('script');

    s.type = 'text/javascript';
    s.text = `var dataLayer = ${JSON.stringify(source)}`;

    this.elementRef.nativeElement.prepend(s);
  }

  private getDataLayerConfig(user?): { [key: string]: any } {
    const data = {
      userAuth: +config.authorized,
      language: this.i18n.currentLang,
      pageType,
    };

    return user ? {
      uid: user.id,
      email: user.email,
      username: user.first_name || user.nickname,
      userId: user.id,
      country: user.country,
      lastTransactionValue: user.last_deposit,
      totalDepositValue: user.deposits_sum,
      ...data,
    } : data;
  }
}

interface Script {
  src: string;
  active: boolean;
}
