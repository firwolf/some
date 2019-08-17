import { Directive, OnDestroy, OnInit, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { env, ciEnv } from 'shared/const';

/**
 * Directive for optional display of content depending on the environment
 *
 * @example
 * <component *env="'development production'"></component>
 *
 * @example
 * <component *env="['production', 'development']"></component>
 *
 */
@Directive({
  selector: '[env]',
})
export class EnvDirective implements OnInit, OnDestroy {
  environment: string[] = [];

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

  /**
   * Gets allowable environment value
   * @param  val - Allowable environment value (or array of values).
   */
  @Input()
  set env(val: string | string[]) {
    if (!val) return;
    typeof val === 'string' && (val = val.split(' '));
    this.environment = val;
  }

  ngOnInit() {
    [env, ciEnv].some(v => this.environment.includes(v)) &&
      this.viewContainer.createEmbeddedView(this.templateRef);
  }

  ngOnDestroy() {
    this.viewContainer.clear();
  }
}
