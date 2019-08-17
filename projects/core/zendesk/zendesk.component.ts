import { Component, OnDestroy, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Observable, Subject, merge } from 'rxjs';
import { distinctUntilChanged, takeUntil, skipWhile, tap } from 'rxjs/operators';

import { State, StateProp, StreamProp } from '@vision/rx';
import isMobile from 'ismobilejs';

import { config } from 'core/config';

declare global {
  interface Window {
    zE: any;
    $zopim: any;
  }
}

@Component({
  selector: 'app-zendesk',
  templateUrl: './zendesk.tpl.pug',
  styleUrls: ['./zendesk.scss'],
})
export class ZendeskComponent implements OnDestroy {
  state: State<{ isOpen: boolean; }> = new State({ isOpen: false });

  @StateProp() isOpen: boolean;
  @StreamProp() isOpen$: Observable<boolean>;

  @Input() user;

  isChina = config.geo === 'CN';
  isLoading = false;
  isMobile = isMobile.phone;

  private chatEl: HTMLElement;

  private destroyed$ = new Subject<void>();

  constructor(private i18n: TranslateService) {}

  get shouldPreload(): boolean {
    return !this.chatEl && !this.isLoading;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  preloadChat(): void {
    this.isLoading = true;

    // Dynamcally load zendesk's bootstrap code
    import('./zendesk-init');

    const chatDisplayChange$ = new Observable(subject => {
      // Observe chat element's insertion in the DOM to know when it's completely loaded
      const bodyChildrenObserver = new MutationObserver(() => {
        const chatEl: HTMLElement = document.querySelector('.zEWidget-webWidget');
        const chatBtn = document.querySelector('.zEWidget-launcher');

        if (!chatEl || !chatBtn) return;

        this.isLoading = false;

        bodyChildrenObserver.disconnect();

        this.chatEl = chatEl;

        subject.next(this.isOpen);

        window.zE.setLocale(this.i18n.currentLang);
        window.$zopim.livechat.window.setTitle('Support');

        (document.querySelector('iframe[id=launcher]') as HTMLElement).style.display = 'none';
      });

      bodyChildrenObserver.observe(document.body, { childList: true });

      return () => bodyChildrenObserver.disconnect();
    });

    merge(chatDisplayChange$, this.isOpen$).pipe(
      skipWhile(() => this.isLoading),
      takeUntil(this.destroyed$),
      distinctUntilChanged(),
      tap((isOpen: boolean) => this.isOpen = isOpen),
    ).subscribe(isOpen => isOpen ? this.open() : this.close());
  }

  private open(): void {
    const { user } = this;

    if (user) {
      const name = `${user.first_name} ${user.last_name}`;
      window.zE(() => {
        window.$zopim.livechat.set({
          id: user.id,
          email: user.email,
          name: name === ' ' ? '' : name,
        });
      });
    }

    window.zE(() => {
      window.$zopim.livechat.window.onHide(() => {
        this.isOpen = false;
      });
    });

    window.zE.activate();
  }

  private close(): void {
    window.zE.hide();
  }
}
