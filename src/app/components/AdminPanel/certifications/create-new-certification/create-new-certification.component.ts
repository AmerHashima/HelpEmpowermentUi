import { Component, computed, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { SpkNgSelectComponent } from '../../../../shared/spk-ng-select/spk-ng-select.component';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { FileUploadComponent } from '../../../../shared/file-upload/file-upload.component';
import { CertificationService } from '../../../../Services/certification.service';
import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
import { Certification } from '../../../../models/certification';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-create-certification',
  imports: [SpkNgSelectComponent, ReactiveFormsModule, ButtonComponent,
    InputComponent, FileUploadComponent, AsyncPipe],
  templateUrl: './create-new-certification.component.html',
  styleUrl: './create-new-certification.component.scss'
})
export class CreateNewCertificationComponent {
  private certificationService = inject(CertificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  store = inject(CertificationsStore);
  // id: string = '';
  courseLevels$ = this.certificationService.getCourseLevels();
  courseCategories$ = this.certificationService.getCourseCategories();
  users = [
    { label: 'Ahmed Ali', value: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
  ];

  status = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },

  ];

  form = this.fb.group({
    courseCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    courseName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    courseDescription: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    courseLevelLookupId: ['', [Validators.required]],
    courseCategoryLookupId: ['', [Validators.required]],
    createdBy: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', [Validators.required]],
    isActive: [true, [Validators.required]],
    // files: [[] as File[]]
  });

  certification= this.store.selectedCertification;
  isEdit = computed(() => !!this.certification()?.oid);


  constructor() {
    const certificationId = this.route.snapshot.paramMap.get('id');
    console.log('certificationId', certificationId);
    effect(() => {
      if (certificationId && !this.certification()) {
        this.store.getCertification(certificationId);
      }
    });



    effect(() => {
      const certification = this.certification();
      if (!certification?.oid) return;
      this.form.patchValue({
        courseCode: certification.courseCode,
        courseName: certification.courseName,
        courseDescription: certification.courseDescription,
        courseLevelLookupId: certification.courseLevelLookupId,
        courseCategoryLookupId: certification.courseCategoryLookupId,
        createdBy: certification.createdBy,
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
    console.log('in edit certification');
    console.log('oid', this.certification()?.oid);
    this.store.updateCertification({ id: this.certification()?.oid!, body: this.getPayload() });
  }

  getPayload() {
    const v = this.form.getRawValue();
    const payload: Certification = {
      ...(this.certification()?.oid ? { oid: this.certification()?.oid } : {}),
      courseCode: v.courseCode!,
      courseName: v.courseName!,
      courseDescription: v.courseDescription!,
      courseLevelLookupId: v.courseLevelLookupId!,
      courseCategoryLookupId: v.courseCategoryLookupId!,
      createdBy: v.createdBy!,
      isActive: v.isActive!,
    };
    return payload;
  }
  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.store.setSelectedCertification(null as any);
    this.router.navigate(['/admin/certifications']);
  }
}

