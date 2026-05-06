import { Component, effect, Inject, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { SpkNgSelectComponent } from '../../../../shared/spk-ng-select/spk-ng-select.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
import { ExamsStore } from '../../../../AdminPanelStores/ExamsStore/exam.store';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../../../Services/breadcrumb.service';
import { courseExam } from '../../../../models/certification';
import { Location } from '@angular/common';
import { createdUpdatedOID } from '../../../../data/lookUPS';

@Component({
  selector: 'app-edit-exam',
  imports: [ButtonComponent, InputComponent, SpkNgSelectComponent, ReactiveFormsModule],
  templateUrl: './edit-exam.component.html',
  styleUrl: './edit-exam.component.scss'
})
export class EditExamComponent {
  private certificationStore = inject(CertificationsStore);
  private examStore = inject(ExamsStore);

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private breadcrumbService = inject(BreadcrumbService);

  fb = inject(FormBuilder);
  // users = [
  //   { label: 'Ahmed Ali', value: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
  // ];

    users = [
      { label: 'Ahmed Ali', value: createdUpdatedOID },

    ];

  status = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];

  freeExam = [
    { label: 'Free', value: true },
    { label: 'Paid', value: false },
  ];

  exam=this.examStore.selectedExam;

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
    freeExam: [false, [Validators.required]],
  });


  certification = this.certificationStore.selectedCertification;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    //     effect(() => {
    //   const certId = this.route.snapshot.paramMap.get('id');
    //   if (!this.certification() && certId) {
    //     this.certificationStore.getCertification(certId);
    //   }
    // });

    this.route.paramMap.subscribe(params => {
      const certId = params.get('id');
      const examId = params.get('examId');

      if (certId && !this.certification()) {
        this.certificationStore.getCertification(certId);
      }

      if (examId && !this.exam()) {
        this.examStore.getExam(examId);
      }
    });


    effect(() => {
      const certification = this.certification();
      if (certification) {
        this.breadcrumbService.setBreadcrumbs([
          { label: 'Admin', url: '/admin' },
          { label: 'Certifications', url: '/admin/certifications' },
          {
            label: certification.courseName || 'Certification',
            url: `/admin/certifications/${certification.oid}`
          },
          { label: 'Edit Exam', url: '' }
        ]);

        this.form.patchValue({
          courseName: certification.courseName,
          examName:this.exam()?.examName ,
          courseLevelLookupId: certification.courseLevelLookupId ?? null,
          courseCategoryLookupId: certification.courseCategoryLookupId ?? null,
          questionCount: this.exam()?.questionCount,
          durationMinutes: this.exam()?.durationMinutes,
          createdBy: this.exam()?.createdBy,
          courseOid: certification.oid,
          isActive: this.exam()?.isActive,
          freeExam: this.exam()?.freeExam
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
      this.editExam();
    }

  }
  editExam() {
    const payload = this.getEditPayload();
    this.examStore.updateExam({id:payload.oid!,body:payload});
  }


  getEditPayload() {
    const v = this.form.getRawValue();
    const payload: courseExam = {
      oid:this.exam()?.oid,
      courseName: v.courseName!,
      freeExam: v.freeExam!,
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
