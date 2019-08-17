import { fromEvent, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { equals } from 'ramda';

export class Spot {
  boundRect$: Observable<DOMRect>;

  private highlighted = false;

  constructor(public element: HTMLElement) {
    this.boundRect$ = fromEvent(window, 'resize').pipe(
      startWith(0),
      map(() => element.getBoundingClientRect()),
      distinctUntilChanged<DOMRect>(equals),
    );
  }

  get isHighlighted(): boolean {
    return this.highlighted;
  }

  set isHighlighted(val: boolean) {
    this.highlighted = val;

    val ? this.highlight() : this.reset();
  }

  private highlight() {
    // this.element.style.boxShadow = '0 2px 12px rgba(0,0,0,.12)';
    // this.element.style.outline = '1px solid var(--color-background-secondary)';
  }

  private reset() {
    // this.element.style.removeProperty('box-shadow');
    // this.element.style.removeProperty('outline');
  }
}
