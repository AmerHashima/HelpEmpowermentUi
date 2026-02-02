import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { CertificationService } from '../../../Services/certification.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Certification, courseExam } from '../../../models/certification';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputComponent } from '../../../shared/input/input.component';
import { SpkNgSelectComponent } from '../../../shared/spk-ng-select/spk-ng-select.component';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-create-new-exam',
  imports: [ButtonComponent,InputComponent,SpkNgSelectComponent,AsyncPipe,ReactiveFormsModule],
  templateUrl: './create-new-exam.component.html',
  styleUrl: './create-new-exam.component.scss'
})
export class CreateNewExamComponent {
  private certificationService = inject(CertificationService);
  fb = inject(FormBuilder);
  // store = inject(CertificationsStore);

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
    courseOid: ['', [Validators.required]],
    courseName: ['', [Validators.required]],
    courseLevelLookupId: ['', [Validators.required]],
    courseCategoryLookupId: ['', [Validators.required]],
    createdBy: ['', [Validators.required]],
    isActive: [true, [Validators.required]],
  });

  @Output() onExamCancalEvent = new EventEmitter<any>();
  certification = input<Certification>({} as Certification);


  constructor(){
    effect(() => {
      const certification = this.certification();
      if (certification) {
        this.form.patchValue({
          courseName: certification.courseName,
          courseLevelLookupId: certification.courseLevelLookupId,
          courseCategoryLookupId: certification.courseCategoryLookupId,
          createdBy: certification.createdBy,
          courseOid: certification.oid,
          isActive: false,
        });
      }
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.valid ) {
      this.createExam();
    }

  }
  createExam() {
    this.certificationService.createExam(this.getPayload()).subscribe({
      next:()=>{this.cancel();}
    });
  }


  getPayload() {
    const v = this.form.getRawValue();
    const payload: courseExam = {
      courseName: v.courseName!,
      courseLevelLookupId: v.courseLevelLookupId!,
      courseCategoryLookupId: v.courseCategoryLookupId!,
      createdBy: v.createdBy!,
      isActive: v.isActive!,
      courseOid: v.courseOid!,

    };
    return payload;
  }
  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.onExamCancalEvent.emit();
  }
}
