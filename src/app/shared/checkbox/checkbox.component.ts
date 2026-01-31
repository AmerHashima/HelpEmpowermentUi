// src\app\shared\checkbox\checkbox.component.ts
import { Component, computed, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface CheckboxOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxComponent,
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  // Inputs
  options = input.required<CheckboxOption[]>();
  label = input<string>('Select options');
  disabled = input<boolean>(false);

  // Internal state
  selectedValues = signal<string[]>([]);   // the array we expose to the form
  isTouched = signal<boolean>(false);

  // CVA callbacks
  onChange: (values: string[]) => void = () => { };
  onTouched: () => void = () => { };

  isDisabled = computed(() => this.disabled());

  writeValue(value: string[] | null | undefined): void {
    this.selectedValues.set(value ?? []);
  }

  registerOnChange(fn: (values: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled via input
  }

  toggle(optionValue: string): void {
    if (this.isDisabled()) return;

    this.selectedValues.update(current => {
      if (current.includes(optionValue)) {
        return current.filter(v => v !== optionValue);
      } else {
        return [...current, optionValue];
      }
    });

    this.onChange(this.selectedValues());
    this.isTouched.set(true);
    this.onTouched();
  }

  isChecked(value: string): boolean {
    return this.selectedValues().includes(value);
  }

  onBlur(): void {
    this.isTouched.set(true);
    this.onTouched();
  }
}
