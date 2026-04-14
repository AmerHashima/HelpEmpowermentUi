// src\app\components\AdminPanel\students\student-form-popup\student-form-popup.component.ts
import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStudent, Student } from '../../../../models/student';
import { AuthService } from '../../../../Services/auth.service';
import { StudentService } from '../../../../Services/student-service.service';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';

type StudentFormModel = Student & { confirmPassword?: string };

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
  formModel: StudentFormModel = this.emptyForm();

  constructor(private studentService: StudentService, private authService: AuthService) {
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

    if (!this.isEditMode()) {
      if (!this.formModel.password?.trim()) {
        this.errorMessage.set('Password is required when creating a student.');
        return;
      }

      if (!this.formModel.confirmPassword?.trim()) {
        this.errorMessage.set('Confirm password is required when creating a student.');
        return;
      }

      if (this.formModel.password !== this.formModel.confirmPassword) {
        this.errorMessage.set('Password and confirm password must match.');
        return;
      }
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    const id = this.studentId();

    if (id) {
      this.studentService.updateStudent(id, this.buildUpdatePayload()).subscribe({
        next: () => this.handleSaveSuccess(),
        error: (error: unknown) => this.handleSaveError(error)
      });
      return;
    }

    this.authService.registerStudent(this.buildRegisterPayload()).subscribe({
      next: () => this.handleSaveSuccess(),
      error: (error: unknown) => this.handleSaveError(error)
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
          password: '',
          confirmPassword: ''
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

  private buildRegisterPayload(): AuthStudent {
    return {
      username: this.formModel.username.trim(),
      password: this.formModel.password?.trim(),
      confirmPassword: this.formModel.confirmPassword?.trim(),
      email: this.formModel.email.trim(),
      nameEn: this.formModel.nameEn.trim(),
      nameAr: this.formModel.nameAr.trim(),
      mobile: this.formModel.mobile.trim()
    };
  }

  private buildUpdatePayload(): Student {
    return {
      oid: this.formModel.oid,
      nameEn: this.formModel.nameEn.trim(),
      nameAr: this.formModel.nameAr.trim(),
      email: this.formModel.email.trim(),
      mobile: this.formModel.mobile.trim(),
      username: this.formModel.username.trim(),
      password: this.formModel.password?.trim() ? this.formModel.password.trim() : undefined
    };
  }

  private handleSaveSuccess(): void {
    this.submitting.set(false);
    this.formModel = this.emptyForm();
    this.saved.emit();
  }

  private handleSaveError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Failed to save student';
    this.errorMessage.set(message);
    this.submitting.set(false);
  }

  private emptyForm(): StudentFormModel {
    return {
      nameEn: '',
      nameAr: '',
      email: '',
      mobile: '',
      username: '',
      password: '',
      confirmPassword: ''
    };
  }
}
