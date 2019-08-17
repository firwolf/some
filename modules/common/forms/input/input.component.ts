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

@Component({
  selector: 'app-input',
  templateUrl: './input.tpl.pug',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  @Input() placeholder: string;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() type: 'text' | 'password' | 'number';
  @Input() size: string = 'md';
  @Input() status: string;
  @Input() mask: any;

  @ViewChild('input', { static: false }) input: ElementRef<any>;

  isNumber: boolean;
  value: string;
  propagateChange: (val: string | number) => void;

  ngAfterViewInit() {
    if (this.type === 'number') {
      this.isNumber = true;
      this.type = 'text';
      this.mask = { regex: '^-?([0]{1}|[1-9]+)(\\.\\d+)?$', placeholder: '' };
    }

    this.input.nativeElement.value = this.value;
  }

  onTouch = () => {};

  onChange(value: string) {
    this.value = value;

    this.propagateChange(this.isNumber
      ? !isNaN(Number(this.value))
        ? Number(this.value)
        : 0
      : this.value);
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
}
