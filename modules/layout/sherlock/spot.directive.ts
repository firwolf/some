import {
  Directive, ElementRef, Input, OnInit,
} from '@angular/core';

import { Sherlock } from './sherlock.service';
import { Spot } from './spot';

@Directive({
  selector: '[spot]',
})
export class SpotDirective implements OnInit {
  @Input() spot: string;

  constructor(private elRef: ElementRef, private sherlock: Sherlock) {}

  ngOnInit() {
    this.sherlock.set(this.spot, new Spot(this.elRef.nativeElement));
  }

  ngOnDestroy() {
    this.sherlock.remove(this.spot);
  }
}
