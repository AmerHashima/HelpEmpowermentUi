// src\app\components\AdminPanel\create-new-exam\create-new-exam.component.ts
import { Component, effect, inject } from '@angular/core';
import { CertificationService } from '../../../Services/certification.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { courseExam } from '../../../models/certification';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputComponent } from '../../../shared/input/input.component';
import { SpkNgSelectComponent } from '../../../shared/spk-ng-select/spk-ng-select.component';
import { AsyncPipe } from '@angular/common';
import { Location } from '@angular/common';
import { CertificationsStore } from '../../../AdminPanelStores/CertificationStore/certification.store';
import { ActivatedRoute } from '@angular/router';
import { ExamsStore } from '../../../AdminPanelStores/ExamsStore/exam.store';
import { BreadcrumbService } from '../../../Services/breadcrumb.service';


@Component({
  selector: 'app-create-new-exam',
  imports: [ButtonComponent, InputComponent, SpkNgSelectComponent, AsyncPipe, ReactiveFormsModule],
  templateUrl: './create-new-exam.component.html',
  styleUrl: './create-new-exam.component.scss'
})
export class CreateNewExamComponent {
  private certificationService = inject(CertificationService);
  private certificationStore = inject(CertificationsStore);
  private examStore = inject(ExamsStore);

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private breadcrumbService = inject(BreadcrumbService);

  fb = inject(FormBuilder);
  // store = inject(CertificationsStore);

  // courseLevels$ = this.certificationService.getCourseLevels();


  // courseCategories$ = this.certificationService.getCourseCategories();

  users = [
    { label: 'Ahmed Ali', value: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
  ];

  status = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];

  form = this.fb.group({
    courseOid: [''],
    courseName: [''],
    examName: ['', [Validators.required]],
    durationMinutes: [0],
    questionCount: [0],
    courseLevelLookupId: [null as string | null],
    courseCategoryLookupId: [null as string | null],
    createdBy: [''],
    isActive: [true, [Validators.required]],
  });


  certification = this.certificationStore.selectedCertification;
  constructor() {
    effect(() => {
      const certId = this.route.snapshot.paramMap.get('id');
      if (!this.certification() && certId) {
        this.certificationStore.getCertification(certId);
      }
    });

    effect(() => {
      const certification = this.certification();
      if (certification) {
        this.breadcrumbService.setBreadcrumbs([
          { label: 'Admin', url: '/admin' },
          { label: 'Certifications', url: '/admin/certifications' },
          { label: certification.courseName || 'Certification', url: `/admin/certifications/${certification.oid}` },
          { label: 'Create Exam', url: '' }
        ]);

        // Calculate next exam name based on existing exams count
        const exams = this.examStore.exams();
        const nextExamNumber = (exams?.length ?? 0) + 1;
        const defaultExamName = `Exam ${nextExamNumber}`;

        this.form.patchValue({
          courseName: certification.courseName,
          examName: defaultExamName,
          courseLevelLookupId: certification.courseLevelLookupId ?? null,
          courseCategoryLookupId: certification.courseCategoryLookupId ?? null,
          questionCount: certification.questionCount ?? 0,
          durationMinutes: certification.durationMinutes ?? 0,
          createdBy: certification.createdBy,
          courseOid: certification.oid,
          isActive: false,
        });
      }
    });

    effect(() => {
      if (this.examStore.success()) {
        this.cancel();
        this.examStore.setSuccess(false);
      }
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.valid) {
      this.createExam();
    }

  }
  createExam() {
    this.examStore.addExam(this.getPayload());
  }


  getPayload() {
    const v = this.form.getRawValue();
    const payload: courseExam = {
      courseName: v.courseName!,
      courseLevelLookupId: v.courseLevelLookupId ?? null,
      durationMinutes: v.durationMinutes ?? 0,
      examName: v.examName!,
      questionCount: v.questionCount ?? 0,
      courseCategoryLookupId: v.courseCategoryLookupId ?? null,
      createdBy: v.createdBy!,
      isActive: v.isActive!,
      courseOid: v.courseOid!,

    };
    return payload;
  }
  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.goBack();
  }

  goBack() {
    this.location.back();
  }
}
