import {
  Component, signal, computed, input,
  Optional, Self, AfterViewInit, inject,
  DestroyRef
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-textarea',
  standalone:true,
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss',
})
export class TextareaComponent implements ControlValueAccessor, AfterViewInit {
  private destroyRef = inject(DestroyRef);

  // Inputs
  label = input<string>('');
  placeholder = input<string>('');
  rows = input<number>(3);
  icon = input<string | undefined>();
  errorMessages = input<Record<string, string>>({});
  readOnly = input<boolean>(false);

  // Signals
  value = signal('');
  isDisabled = signal(false);
  isTouched = signal(false);
  isDirty = signal(false);
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

    control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.statusSignal.set(control.status);
      this.errorsSignal.set(control.errors);
      this.isTouched.set(control.touched);
      this.isDirty.set(control.dirty);
    });

    this.statusSignal.set(control.status);
    this.errorsSignal.set(control.errors);
  }

  // Computed
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

  // ControlValueAccessor
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
    const inputValue = (event.target as HTMLTextAreaElement).value;
    this.value.set(inputValue);
    this.onChange(inputValue);
    this.isDirty.set(true);
  }

  onBlur(): void {
    this.isTouched.set(true);
    this.onTouched();
  }
}


