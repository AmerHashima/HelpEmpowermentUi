import {
  Component,
  input,
  signal,
  WritableSignal,
  computed,
  effect,
  ChangeDetectorRef,   // ← optional but recommended
} from '@angular/core';
import {
  FormArray,
  FormBuilder,          // ← must import
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { ButtonComponent } from '../../../../shared/button/button.component';

@Component({
  selector: 'app-certification-common',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, GenericModelComponent,ButtonComponent],
  templateUrl: './certification-common.component.html',
  styleUrl: './certification-common.component.scss',
})
export class CertificationCommonComponent<T extends { oid?: string }> {
  items = input.required<WritableSignal<T[]>>();
  entityName = input<string>('Item');

  formFactory = input.required<(data?: T) => FormGroup>();
  createFn = input.required<(data: T) => Observable<T>>();
  updateFn = input.required<(id: string, data: T) => Observable<T>>();
  deleteFn = input.required<(id: string) => Observable<void>>();

  // Signals
  showModal = signal(false);
  editingItem = signal<T | null>(null);

  form: FormGroup;

  get formArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private cdr?: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      items: this.fb.array([]),
    });
  }

  openCreate() {
    this.resetForm();
    const newGroup = this.formFactory()();
    this.formArray.push(newGroup);
    this.cdr?.detectChanges();
    this.showModal.set(true);
  }

  openEdit(item: T) {
    this.resetForm();
    this.editingItem.set(item);
    const editGroup = this.formFactory()(item);
    this.formArray.push(editGroup);

    this.cdr?.detectChanges();

    this.showModal.set(true);
  }

  submit() {
    console.log('in submit');
    console.log(this.form.value);
    console.log(this.form.invalid);
    if (this.form.invalid) return;

    const entities = this.formArray.value as T[];

    const requests = entities.map((entity) =>
      entity.oid
        ? this.updateFn()(entity.oid!, entity)
        : this.createFn()(entity)
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        const signal = this.items();
        signal.update((prev: T[]) => {
          const copy = [...prev];
          results.forEach((res) => {
            const idx = copy.findIndex((i) => i.oid === res.oid);
            idx > -1 ? (copy[idx] = res) : copy.push(res);
          });
          return copy;
        });

        this.closeModal();
      },
      error: (err) => console.error('Failed to save', err),
    });
  }

  delete(item: T) {
    if (!item.oid) return;

    this.deleteFn()(item.oid).subscribe(() => {
      const signal = this.items();
      signal.update((prev: T[]) => prev.filter((i) => i.oid !== item.oid));
    });
  }

  closeModal() {
    this.resetForm();
    this.showModal.set(false);
  }

  private resetForm() {
    while (this.formArray.length > 0) {
      this.formArray.removeAt(0);
    }
    this.editingItem.set(null);
  }

  modalTitle = computed(() =>
    this.editingItem() ? `Edit ${this.entityName()}` : `Add ${this.entityName()}`
  );
}
