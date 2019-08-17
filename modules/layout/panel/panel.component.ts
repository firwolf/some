import { Component, OnInit, Type } from '@angular/core';
import { Observable } from 'rxjs';

import { State, fire, StreamProp } from '@vision/rx';

import { panelInited } from '../const';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.tpl.pug',
})
export class PanelComponent implements OnInit {
  state: State<{ component: Type<any> }> = new State({ component: null });

  @StreamProp() component$: Observable<Type<any>>;

  ngOnInit(): void {
    fire(panelInited, this);
  }

  add(component: Type<any>) {
    this.state.patch({
      component,
    });
  }

  reset() {
    this.state.reset();
  }
}
