import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  Input, OnDestroy,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { fromEvent, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { eqBy, path } from 'ramda';

@Component({
  selector: 'app-select',
  templateUrl: './select.tpl.pug',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @Input() placeholder: string;
  @Input() defaultFirst: boolean;
  @Input() selected: string[] | string = '';
  @Input() multiple: boolean;
  @Input() status: 'valid' | 'invalid' | 'warning' | '';

  @ViewChild('select', { static: false }) select: ElementRef<any>;

  value: string;
  propagateChange: (val: string | number) => void;

  eventSub = new Subscription();

  ngAfterViewInit() {
    this.select.nativeElement.selected = this.value;

    this.eventSub.add(
      fromEvent(this.select.nativeElement, 'vuiScroll').pipe(
        distinctUntilChanged(eqBy(path(['detail', 'scrollTop']))),
        map(path(['detail', 'e'])),
      ).subscribe((event: Event) => event.stopPropagation()),
    );
  }

  onTouch = () => {};

  onChange(value: string) {
    this.value = value;

    this.propagateChange(this.value);
    this.onTouch();
  }

  writeValue(value: string) {
    this.value = value;
  }

  registerOnChange(fn: (val: string) => void) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouch = fn;
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }
}
