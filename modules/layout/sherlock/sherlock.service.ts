import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { omit, prop, isNil, complement } from 'ramda';

import { State, StateProp, StreamProp } from '@vision/rx';

import { Spot } from './spot';

@Injectable()
export class Sherlock {
  protected state = new State({
    storage: {},
  });

  @StateProp() private storage: { [key: string]: Spot };
  @StreamProp() private storage$: Observable<{ [key: string]: Spot }>;

  set(id: string, spot: Spot) {
    this.storage = { ...this.storage, [id]: spot };
  }

  remove(id: string) {
    this.storage = omit([id], this.storage);
  }

  find(id: string): Observable<Spot> {
    return this.storage$.pipe(
      map(prop(id)),
      filter(complement(isNil)),
    );
  }
}
