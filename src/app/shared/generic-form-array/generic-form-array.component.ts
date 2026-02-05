import {
  Component,
  input,
  output,
  TemplateRef,
  ContentChild,
  effect,
  inject
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import {
  LowerCasePipe,
  NgFor,
  NgIf,
  NgTemplateOutlet
} from '@angular/common';

@Component({
  selector: 'app-generic-form-array',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    LowerCasePipe,
    NgTemplateOutlet
  ],
  templateUrl: './generic-form-array.component.html',
  styleUrl: './generic-form-array.component.scss'
})
export class GenericFormArrayComponent<T> {
  formFactory = input.required<(initial?: Partial<T>) => FormGroup>();
  entityName = input.required<string>();

  initialItems = input<T[]>([]);
  minRows = input<number>(1);
  allowAddMore = input<boolean>(true);

  submit = output<T[]>();
  cancel = output<void>();

  private fb = inject(FormBuilder);

  form = this.fb.group({
    rows: this.fb.array<FormGroup>([])
  });

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  @ContentChild('row') rowTemplate!: TemplateRef<any>;

  // 🔒 guard flag
  private initialized = false;

  constructor() {
    effect(() => {
      if (this.initialized) return; // ✅ DO NOT rebuild

      const items = this.initialItems();
      this.rows.clear();

      if (!items.length && this.minRows() > 0) {
        for (let i = 0; i < this.minRows(); i++) {
          this.addRow();
        }
      } else {
        items.forEach(item => this.addRow(item));
      }

      this.initialized = true; // ✅ lock it
    });
  }

  addRow(initial?: Partial<T>) {
    const group = this.formFactory()(initial);
    this.rows.push(group);
  }

  removeRow(index: number) {
    if (this.rows.length > this.minRows()) {
      this.rows.removeAt(index);
    }
  }

  handleSubmit() {
    console.log(this.form.value);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }


    this.submit.emit(this.rows.getRawValue() as T[]);
  }
}
