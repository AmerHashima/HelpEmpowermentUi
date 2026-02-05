import {
  Component, signal, computed, input,
  Optional, Self, AfterViewInit, inject,
  DestroyRef
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  private destroyRef = inject(DestroyRef);

  // Inputs
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  icon = input<string | undefined>();
  errorMessages = input<Record<string, string>>({});
  readOnly = input<boolean>(false);
  // Value signals
  value = signal('');
  isDisabled = signal(false);
  isTouched = signal(false);
  isDirty = signal(false);

  // Form control signals
  statusSignal = signal<string>('VALID');
  errorsSignal = signal<Record<string, any> | null>(null);

  // CVA callbacks
  private onChange = (_: any) => { };
  private onTouched = () => { };

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngAfterViewInit() {
    const control = this.ngControl?.control;
    if (!control) return;

    // Single subscription with automatic cleanup
    control.events.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.statusSignal.set(control.status);
      this.errorsSignal.set(control.errors);
      this.isTouched.set(control.touched);
      this.isDirty.set(control.dirty);
    });

    // Set initial values
    this.statusSignal.set(control.status);
    this.errorsSignal.set(control.errors);
  }

  // Computed signals
  showErrors = computed(() =>
    (this.isTouched() || this.isDirty()) &&
    this.statusSignal() === 'INVALID'
  );

  errorMessage = computed(() => {
    const errors = this.errorsSignal();
    if (!errors) return '';

    const errorKey = Object.keys(errors)[0];
    return this.errorMessages()[errorKey]
      || errors[errorKey]?.message
      || 'Invalid value';
  });

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // Event handlers
  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.value.set(inputValue);
    this.onChange(inputValue);
    this.isDirty.set(true);
  }

  onBlur(): void {
    this.isTouched.set(true);
    this.onTouched();
  }
}

