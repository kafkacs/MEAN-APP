import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-radio-input',
  imports: [],
  templateUrl: './radio-input.html',
  styleUrl: './radio-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioInput),
      multi: true,
    },
  ],
})
export class RadioInput implements ControlValueAccessor {
  @Input() label = '';
  @Input() options: { label: string; value: any }[] = [];

  value: any;
  disabled = false;

  onChange = (value: any) => {
    console.log('Value changed:', value);
  };
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  select(value: any) {
    if (this.disabled) return;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
