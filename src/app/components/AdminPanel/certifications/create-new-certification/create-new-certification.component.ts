// src\app\components\AdminPanel\certifications\create-new-certification\create-new-certification.component.ts
import { Component, computed, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpkNgSelectComponent } from '../../../../shared/spk-ng-select/spk-ng-select.component';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { CertificationService } from '../../../../Services/certification.service';
import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
import { Certification } from '../../../../models/certification';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BreadcrumbService } from '../../../../Services/breadcrumb.service';
import { createdUpdatedOID } from '../../../../data/lookUPS';

@Component({
  selector: 'app-create-certification',
  imports: [SpkNgSelectComponent, ReactiveFormsModule, ButtonComponent,
    InputComponent],
  templateUrl: './create-new-certification.component.html',
  styleUrl: './create-new-certification.component.scss'
})
export class CreateNewCertificationComponent {
  readonly defaultImage = 'assets/images/certifications/certfication_1.jpeg';
  private certificationService = inject(CertificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private breadcrumbService = inject(BreadcrumbService);
  private readonly certificationId = this.route.snapshot.paramMap.get('id');

  fb = inject(FormBuilder);
  store = inject(CertificationsStore);
  // courseLevels$ = this.certificationService.getCourseLevels();
  // courseCategories$ = this.certificationService.getCourseCategories();
  users = [
    // { label: 'Ahmed Ali', value: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
    { label: 'Ahmed Ali', value: createdUpdatedOID },

  ];

  status = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];

  form = this.fb.group({
    courseCode: [''],
    courseName: ['', [Validators.required]],
    courseDescription: [''],
    certificateNumber: [null as number | null, [Validators.min(1)]],

    durationMinutes: [0],
    questionCount: [0],
    // courseLevelLookupId: ['', [Validators.required]],
    // courseCategoryLookupId: ['', [Validators.required]],
    courseLevelLookupId: [null as string | null],
    courseCategoryLookupId: [null as string | null],
    userId: [createdUpdatedOID, [Validators.required]],
    // createdBy: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', [Validators.required]],
    isActive: [true],
    files: [[] as File[]]
  });

  certification = this.store.selectedCertification;
  isEdit = computed(() => !!this.certificationId);
  formError = signal('');
  selectedImage = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  imageUploading = signal(false);


  constructor() {
    effect(() => {
      if (this.certificationId && this.certification()?.oid !== this.certificationId) {
        this.store.getCertification(this.certificationId);
      }
    });

    effect(() => {
      const isEdit = this.isEdit();
      const cert = this.certification();

      if (isEdit && cert) {
        this.breadcrumbService.setBreadcrumbs([
          { label: 'Admin', url: '/admin' },
          { label: 'Certifications', url: '/admin/certifications' },
          { label: cert.courseName || 'Certification', url: `/admin/certifications/${cert.oid}` },
          { label: 'Edit', url: '' }
        ]);
      } else if (!isEdit) {
        this.breadcrumbService.setBreadcrumbs([
          { label: 'Admin', url: '/admin' },
          { label: 'Certifications', url: '/admin/certifications' },
          { label: 'Create', url: '' }
        ]);
      }
    });



    effect(() => {
      const certification = this.certification();
      if (!certification?.oid) return;
      this.form.patchValue({
        courseCode: certification.courseCode,
        courseName: certification.courseName,
        courseDescription: certification.courseDescription,
        certificateNumber: certification.certificateNumber ?? null,

        durationMinutes: certification.durationMinutes,
        courseLevelLookupId: certification.courseLevelLookupId ?? null,
        courseCategoryLookupId: certification.courseCategoryLookupId ?? null,
        userId: certification.createdBy? certification.createdBy : createdUpdatedOID,
        questionCount: certification.questionCount,
        isActive: certification.isActive,
      });
    });
    effect(() => {
      const success = this.store.success();
      if (!success) return;

      const savedCertification = this.certification();
      this.store.setSuccess(false);
      if (!savedCertification?.oid) return;
      const savedCertificationId = savedCertification.oid;
      const image = this.selectedImage();
      if (image) {
        this.imageUploading.set(true);
        this.certificationService.uploadCertificationImage(savedCertificationId, image).subscribe({
          next: certification => {
            this.store.setSelectedCertification(certification);
            this.finishSave(savedCertificationId);
          },
          error: error => {
            this.imageUploading.set(false);
            this.formError.set(error?.message || 'Certification was saved, but its image could not be uploaded.');
          }
        });
        return;
      }
      this.finishSave(savedCertificationId);
    });
  }




  onSubmit() {
    this.formError.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const invalidFields = Object.entries(this.form.controls)
        .filter(([, control]) => control.invalid)
        .map(([name]) => name);
      this.formError.set(`Please correct the following fields: ${invalidFields.join(', ')}.`);
      return;
    }

    if (this.isEdit()) {
      this.editCertificaion();
    } else {
      this.createCertification();
    }
  }
  createCertification() {
    this.store.addCertification(this.getPayload());
  }
  editCertificaion() {
    this.store.updateCertification({ id: this.certification()?.oid!, body: this.getPayload() });
  }

  getPayload() {
    const v = this.form.getRawValue();
    const isEdit = !!this.certification()?.oid;

    const payload: Certification = {
      ...(isEdit ? { oid: this.certification()?.oid } : {}),

      // courseCode: v.courseCode!,
      courseCode: v.courseCode?.trim() || v.courseName!,
      courseName: v.courseName!,
      courseDescription: v.courseDescription!,
      certificateNumber: this.toCertificateNumber(v.certificateNumber),
      durationMinutes: v.durationMinutes!,
      courseLevelLookupId: v.courseLevelLookupId ?? null,
      courseCategoryLookupId: v.courseCategoryLookupId ?? null,

      ...(isEdit
        ? { updatedBy: v.userId! }
        : { createdBy: v.userId! }),

      questionCount: v.questionCount!,
      recordedCourseReservPrice: this.certification()?.recordedCourseReservPrice ?? null,
      examSimulationReservPrice: this.certification()?.examSimulationReservPrice ?? null,
      liveCourseReservPrice: this.certification()?.liveCourseReservPrice ?? null,
      isActive: v.isActive!,
    };

    return payload;
  }

  private toCertificateNumber(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') return null;

    const certificateNumber = Number(value);
    return Number.isFinite(certificateNumber) ? certificateNumber : null;
  }
  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.formError.set('Please select a valid image file.');
      return;
    }
    this.selectedImage.set(file);
    this.imagePreview.set(URL.createObjectURL(file));
  }

  removeSelectedImage() {
    const preview = this.imagePreview();
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    this.selectedImage.set(null);
    this.imagePreview.set(null);
  }

  certificationImageUrl(): string {
    const certification = this.certification();
    return certification?.oid && certification.imagePath
      ? this.certificationService.getCertificationImageUrl(certification.oid)
      : this.defaultImage;
  }

  useDefaultImage(event: Event) {
    (event.target as HTMLImageElement).src = this.defaultImage;
  }

  private finishSave(id: string) {
    this.imageUploading.set(false);
    this.form.markAsUntouched();
    if (!this.certificationId) this.router.navigate(['/admin/certifications', id, 'content']);
    else this.cancel();
  }
  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.store.setSelectedCertification(null as any);
    // if (this.isEdit())
    //   this.location.back();
    // else
    this.router.navigate(['/admin/certifications']);
  }
}

