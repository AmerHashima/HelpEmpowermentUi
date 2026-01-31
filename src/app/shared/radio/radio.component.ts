// src\app\shared\radio\radio.component.ts
import { Component, computed, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface RadioOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

@Component({
  selector: 'app-radio',
  imports: [],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss'
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadioComponent,
      multi: true,
    },
  ],
})
export class RadioComponent<T = string> implements ControlValueAccessor {
  // Inputs
  options = input.required<RadioOption<T>[]>();
  label = input<string>('Select one option');
  name = input<string>('radio-group-' + Math.random().toString(36).slice(2, 9));
  disabled = input<boolean>(false);

  // Internal state
  selectedValue = signal<T | null>(null);
  isTouched = signal<boolean>(false);

  // CVA callbacks
  onChange: (value: T | null) => void = () => { };
  onTouched: () => void = () => { };

  isGroupDisabled = computed(() => this.disabled());

  writeValue(value: T | null | undefined): void {
    this.selectedValue.set(value ?? null);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Input already handles it
  }

  select(value: T): void {
    if (this.isGroupDisabled()) return;

    this.selectedValue.set(value);
    this.onChange(value);
    this.isTouched.set(true);
    this.onTouched();
  }

  onBlur(): void {
    this.isTouched.set(true);
    this.onTouched();
  }

  isSelected(optValue: T): boolean {
    return this.selectedValue() === optValue;
  }
}
