import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { VUIInputCounterEvent } from './interface';
import { findNearest } from './utils';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.tpl.pug',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CounterComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent implements ControlValueAccessor, AfterViewInit {
  @Input() placeholder: string;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() step: string | number = 1;
  @Input() min: string | number;
  @Input() max: string | number;

  @ViewChild('counter', { static: false }) counter: ElementRef<any>;

  value: number;
  propagateChange: (val: number) => void;

  ngAfterViewInit() {
    this.counter.nativeElement.value = this.value;
  }

  onTouch = () => {};

  onChange(e: VUIInputCounterEvent) {
    if (e.direction) {
      this.value = Number(findNearest(e.direction, this.min, this.max, +this.step, this.value)
        .toFixed(2));
      this.counter.nativeElement.value = this.value;
    } else this.value = +e.value;

    this.propagateChange(this.value);
    this.onTouch();
  }

  writeValue(value: number) {
    this.value = value;
  }

  registerOnChange(fn: (val: number) => void) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouch = fn;
  }
}
