// src\app\components\AdminPanel\students\student-form-popup\student-form-popup.component.ts
import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Student } from '../../../../models/student';
import { StudentService } from '../../../../Services/student-service.service';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';

@Component({
  selector: 'app-student-form-popup',
  imports: [CommonModule, FormsModule, GenericModelComponent],
  templateUrl: './student-form-popup.component.html',
  styleUrl: './student-form-popup.component.scss'
})
export class StudentFormPopupComponent {
  isOpen = input.required<boolean>();
  studentId = input<string | null>(null);

  closed = output<void>();
  saved = output<void>();

  loading = signal(false);
  submitting = signal(false);
  errorMessage = signal('');
  formModel: Student = this.emptyForm();

  constructor(private studentService: StudentService) {
    effect(() => {
      const open = this.isOpen();
      const id = this.studentId();

      if (!open) {
        return;
      }

      this.errorMessage.set('');

      if (id) {
        this.loadStudent(id);
      } else {
        this.formModel = this.emptyForm();
      }
    });
  }

  isEditMode(): boolean {
    return !!this.studentId();
  }

  onClose(): void {
    this.formModel = this.emptyForm();
    this.errorMessage.set('');
    this.closed.emit();
  }

  saveStudent(): void {
    if (!this.formModel.nameEn.trim() || !this.formModel.nameAr.trim() || !this.formModel.email.trim() || !this.formModel.mobile.trim() || !this.formModel.username.trim()) {
      this.errorMessage.set('Please fill all required fields.');
      return;
    }

    if (!this.isEditMode() && !this.formModel.password?.trim()) {
      this.errorMessage.set('Password is required when creating a student.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    const payload: Student = {
      ...this.formModel,
      password: this.formModel.password?.trim() ? this.formModel.password : undefined
    };

    const id = this.studentId();
    const request$ = id
      ? this.studentService.updateStudent(id, payload)
      : this.studentService.createStudent(payload);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.formModel = this.emptyForm();
        this.saved.emit();
      },
      error: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Failed to save student';
        this.errorMessage.set(message);
        this.submitting.set(false);
      }
    });
  }

  private loadStudent(id: string): void {
    this.loading.set(true);

    this.studentService.getStudent(id).subscribe({
      next: (student) => {
        this.formModel = {
          oid: student.oid,
          nameEn: student.nameEn,
          nameAr: student.nameAr,
          email: student.email,
          mobile: student.mobile,
          username: student.username,
          password: ''
        };
        this.loading.set(false);
      },
      error: (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Failed to load student details';
        this.errorMessage.set(message);
        this.loading.set(false);
      }
    });
  }

  private emptyForm(): Student {
    return {
      nameEn: '',
      nameAr: '',
      email: '',
      mobile: '',
      username: '',
      password: ''
    };
  }
}
