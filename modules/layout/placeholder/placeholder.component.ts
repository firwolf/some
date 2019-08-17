import { Component, OnInit, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { State, StreamProp, fire } from '@vision/rx';

import { placeholderInited } from '../const';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.tpl.pug',
  styleUrls: ['./placeholder.scss'],
})
export class PlaceholderComponent implements OnInit {
  @StreamProp() holder$: Observable<Type<any>>;

  private state = new State({
    holder: null as Type<any>,
  });

  ngOnInit() {
    fire(placeholderInited, this);
  }

  setComponent(component: Type<any>) {
    this.state.next({ holder: component });
  }

  reset() {
    this.state.reset();
  }
}
