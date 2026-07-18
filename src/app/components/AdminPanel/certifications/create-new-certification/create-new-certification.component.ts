// src\app\components\AdminPanel\certifications\create-new-certification\create-new-certification.component.ts
import { Component, computed, effect, inject } from '@angular/core';
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
  private certificationService = inject(CertificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private breadcrumbService = inject(BreadcrumbService);

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
    certificateNumber: ['', [Validators.maxLength(100)]],

    durationMinutes: [0],
    questionCount: [0],
    // courseLevelLookupId: ['', [Validators.required]],
    // courseCategoryLookupId: ['', [Validators.required]],
    courseLevelLookupId: [null as string | null],
    courseCategoryLookupId: [null as string | null],
    userId: [createdUpdatedOID, [Validators.required]],
    // createdBy: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', [Validators.required]],
    isActive: [true, [Validators.required]],
    files: [[] as File[]]
  });

  certification = this.store.selectedCertification;
  isEdit = computed(() => !!this.certification()?.oid);


  constructor() {
    const certificationId = this.route.snapshot.paramMap.get('id');
    effect(() => {
      if (certificationId && !this.certification()) {
        this.store.getCertification(certificationId);
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
        certificateNumber: certification.certificateNumber ?? '',

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
      if (success)
        this.cancel();
      this.store.setSuccess(false);
    });
  }




  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }


    if (this.form.valid && this.isEdit()) {
      this.editCertificaion();
    }

    if (this.form.valid && !this.isEdit()) {
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
      certificateNumber: v.certificateNumber?.trim() || null,
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

