import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { colors } from './const';
import { State, StateProp, StreamProp } from '@vision/rx';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-colorpicker',
  templateUrl: './colorpicker.tpl.pug',
  styleUrls: ['./colorpicker.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ColorPickerComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent implements ControlValueAccessor  {
  state = new State({
    value: '',
  });

  colors: string[] = colors;

  @StateProp() value: string;
  @StreamProp() value$: Observable<string>;

  @Input() outline: boolean;

  propagateChange: (val: string) => void;

  onTouch = () => {};

  onChange(color: string) {
    this.value = color;

    this.propagateChange(this.value);
    this.onTouch();
  }

  writeValue(color: string) {
    this.value = color;
  }

  registerOnChange(fn: (val: string) => void) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouch = fn;
  }
}
