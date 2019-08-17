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
  selector: 'app-checkbox',
  templateUrl: './checkbox.tpl.pug',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent implements ControlValueAccessor, AfterViewInit {
  @Input() label: string;
  @Input() disabled: boolean;
  @Input() checked: boolean = false;

  @ViewChild('checkbox', { static: false }) checkbox: ElementRef<any>;

  value: boolean;
  propagateChange: (val: boolean) => void;

  ngAfterViewInit() {
    this.checkbox.nativeElement.checked = this.value;
  }

  onTouch = () => {};

  onChange(res: { checked: boolean, value: string }) {
    this.value = res.checked;
    this.propagateChange(this.value);
    this.onTouch();
  }

  writeValue(value: boolean) {
    this.value = value;
  }

  registerOnChange(fn: (val: boolean) => void) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouch = fn;
  }
}
