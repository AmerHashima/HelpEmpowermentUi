// form-item.component.ts
import { Component, effect, inject, input, output, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // ← ADD THIS

@Component({
  selector: 'app-form-item',
  standalone: true,  // ← ADD standalone: true
  imports: [CommonModule, ReactiveFormsModule],  // ← FIX: Add CommonModule
  templateUrl: './form-item.component.html',
  styleUrl: './form-item.component.scss'
})
export class FormItemComponent {
  private fb = inject(FormBuilder);

  className = input<string>('');
  defaultValues = input<Record<string, any>>({});

  onSubmit = output<any>();

  form = signal<FormGroup>(this.fb.group({}));

  isFormValid = computed(() => this.form().valid);
  isFormInvalid = computed(() => this.form().invalid);
  formValue = computed(() => this.form().value);

  constructor() {
    effect(() => {
      const defaults = this.defaultValues();
      const group = this.fb.group({});

      Object.entries(defaults).forEach(([key, initialValue]) => {
        group.addControl(key, this.fb.control(initialValue));
      });

      this.form.set(group);
    });
  }

  handleSubmit() {
    const formGroup = this.form();
    if (!formGroup) return;

    // Mark all fields as touched
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });

    if (formGroup.valid) {
      this.onSubmit.emit(formGroup.value);
    } else {
      console.warn('Form invalid:', formGroup.errors);
    }
  }
}
