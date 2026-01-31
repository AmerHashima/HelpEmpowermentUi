// src\app\components\AdminPanel\create-new-certification\create-new-certification.component.ts
import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CertificationsStore } from '../../../AdminPanelStores/CertificationStore/certification.store';
import { SpkNgSelectComponent } from '../../../shared/spk-ng-select/spk-ng-select.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputComponent } from '../../../shared/input/input.component';
import { Certification } from '../../../models/certification';
import { FileUploadComponent } from '../../../shared/file-upload/file-upload.component';

@Component({
  selector: 'app-create-certification',
  imports: [SpkNgSelectComponent, ReactiveFormsModule, ButtonComponent,
    InputComponent, FileUploadComponent],
  templateUrl: './create-new-certification.component.html',
  styleUrl: './create-new-certification.component.scss'
})
export class CreateNewCertificationComponent {
  fb = inject(FormBuilder);
  store = inject(CertificationsStore);
  id: string = '';

  courseLevels = [
    { label: 'Beginner', value: 'BEGINNER' },
    { label: 'Intermediate', value: 'INTERMEDIATE' },
    { label: 'Advanced', value: 'ADVANCED' },
    { label: 'Professional', value: 'PROFESSIONAL' }
  ];


  courseCategories = [
    { label: 'Web Development', value: 'WEB_DEV' },
    { label: 'Mobile Development', value: 'MOBILE_DEV' },
    { label: 'Backend Development', value: 'BACKEND_DEV' },
    { label: 'Frontend Development', value: 'FRONTEND_DEV' },
    { label: 'UI / UX Design', value: 'UI_UX' },
    { label: 'Data Science', value: 'DATA_SCIENCE' },
    { label: 'Artificial Intelligence', value: 'AI' },
    { label: 'Cyber Security', value: 'CYBER_SECURITY' }
  ];

  users = [
    { label: 'Ahmed Ali', value: 'ADMIN' },
    { label: 'Mohamed Ahmed', value: 'INSTRUCTOR' },
    { label: 'Shaimaa Kamal', value: 'STUDENT' },
    { label: 'Reem Mohamed', value: 'GUEST' }
  ];

  form = this.fb.group({
    courseCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    courseName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    courseDescription: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    courseLevelLookupId: ['', [Validators.required]],
    courseCategoryLookupId: ['', [Validators.required]],
    createdBy: ['', [Validators.required]],
    files: [[] as File[]]
  });

  oid = input<string>('');
  @Output() cancalEvent = new EventEmitter<any>();

  constructor() {

    effect(() => {
      const oid = this.oid();
      if (!oid) {
        this.form.reset();
        return;
      }
      this.store.getCertification(oid);
    });

    effect(() => {
      const certification = this.store.selectedCertification();
      if (certification) {
        this.form.patchValue({
          courseCode: certification.courseCode,
          courseName: certification.courseName,
          courseDescription: certification.courseDescription,
          courseLevelLookupId: certification.courseLevelLookupId,
          courseCategoryLookupId: certification.courseCategoryLookupId,
          createdBy: certification.createdBy
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value.files); // File[]

    if (this.form.valid && !this.oid()) {
      this.createCertification();
    }
    if (this.form.valid && this.oid()) {
      this.editCertificaion();
    }
  }
  createCertification() {
    this.store.addCertification(this.getPayload());
  }
  editCertificaion() {
    this.store.updateCertification({ id: this.oid(), body: this.getPayload() });
  }

  getPayload() {
    const v = this.form.getRawValue();
    const payload: Certification = {
      ...(this.oid() ? { oid: this.oid() } : {}),
      courseCode: v.courseCode!,
      courseName: v.courseName!,
      courseDescription: v.courseDescription!,
      courseLevelLookupId: v.courseLevelLookupId!,
      courseCategoryLookupId: v.courseCategoryLookupId!,
      createdBy: v.createdBy!,
    };
    return payload;
  }
  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.cancalEvent.emit();
  }
}

