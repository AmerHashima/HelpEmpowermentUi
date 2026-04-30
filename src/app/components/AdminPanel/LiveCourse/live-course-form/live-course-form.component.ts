import { Component, effect, inject, input, output } from '@angular/core';
import { LookupService } from '../../../../Services/lookup.service';
import { Shared } from '../../../../shared/Services/shared/shared';
import { LiveCourseService } from '../../../../Services/live-course.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActiveStatus, createdUpdatedOID, webinarPresentationFormat } from '../../../../data/lookUPS';
import { LiveCourse } from '../../../../models/liveCourse';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { TranslatePipe } from '@ngx-translate/core';
import { SpkNgSelectComponent } from '../../../../shared/spk-ng-select/spk-ng-select.component';
import { TextareaComponent } from '../../../../shared/text-area/text-area.component';

@Component({
  selector: 'app-live-course-form',
  imports: [ReactiveFormsModule, SiteButtonComponent, InputComponent, TranslatePipe, SpkNgSelectComponent,
    TextareaComponent
  ],
  templateUrl: './live-course-form.component.html',
  styleUrl: './live-course-form.component.scss'
})
export class LiveCourseFormComponent {
  private LookupService = inject(LookupService);
  private shared = inject(Shared);
  private liveCourseService = inject(LiveCourseService);
  isRTL = this.shared.isRtl;
  certifications = this.shared.certifications;
  oid = input<string>('');
  cancalEvent = output<void>();
  fb = inject(FormBuilder);
  status = ActiveStatus;
  // webinarFormats$ = this.LookupService.getWebinarFormat();
  // timeZone$ = this.LookupService.getTimeZones();
  // specialities = computed(() => this.store.specialities());
  form = this.fb.group({
    courseName: ['', Validators.required],
    courseOid: ['', Validators.required],
    courseFormat: ['', Validators.required],
    startDate: ['', Validators.required],
    startTime: ['', Validators.required],
    timeZone: ['', Validators.required],
    numberOfSessions: [0, Validators.required],
    totalHours: [0, Validators.required],
    whatsAppLink: ['', Validators.required],
    scheduleNotes: [''],
    notes: [''],
    isActive: [false, Validators.required],
  });


  constructor() {

    effect(() => {
      const oid = this.oid();
      if (!oid) {
        this.form.reset();
        return;
      }
      // this.store.getBranch(oid);
    });

    effect(() => {
      // const speciality = this.store.selectedSpeciality();
      // // const branch = this.store.selectedItem();
      // if (branch) {
      //   this.form.patchValue({
      //     code: branch.code,
      //     name: branch.name,
      //     state: branch.state ? branch.state : null,
      //     country: branch.country,
      //     city: branch.city,
      //     postalCode: branch.postalCode,
      //     address: branch.address,
      //     isActive: branch.isActive,
      //   });
      // }
    });


  }
  getInvalidControls(): string[] {
    const controls = this.form.controls;

    return Object.keys(controls).filter(key => {
      const control = controls[key as keyof typeof controls];

      if (control.invalid) {
        console.log('❌ Field:', key);
        console.log('Errors:', control.errors);
        console.log('Value:', control.value);
      }

      return control.invalid;
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.getInvalidControls();
      console.log('invalid');
      return;
    }
    if (this.form.valid && !this.oid()) {
      this.createLiveCourse();
    }
    if (this.form.valid && this.oid()) {
      this.editLiveCourse();
    }
  }
  createLiveCourse() {
    this.liveCourseService.createLiveCourse(this.getPayload()).subscribe({
      next: () => this.cancel()
    })
  }
  editLiveCourse() {
    this.liveCourseService.updateLiveCourse(this.oid(), this.getPayload()).subscribe({
      next: () => this.cancel()
    })
  }

  getPayload() {
    const v = this.form.getRawValue();
    const payload: LiveCourse = {
      ...(this.oid() ? { oid: this.oid() } : {}),
      courseName: v.courseName ?? '',
      courseOid: v.courseOid ?? '',
      courseFormat: webinarPresentationFormat,
      // courseFormat: v.courseFormat ?? '',
      startDate: this.shared.formatDateToISO(v.startDate ?? ''),
      startTime: v.startTime ?? '',
      // timeZone: v.timeZone ?? '',
      timeZone: 'SAR',
      whatsAppLink: v.whatsAppLink ?? '',
      notes: v.notes ?? '',
      totalHours: v.totalHours ?? 0,
      numberOfSessions: v.numberOfSessions ?? 0,
      scheduleNotes: v.scheduleNotes ?? '',
      isActive: v.isActive ?? true,
      createdBy: createdUpdatedOID,
    };
    return payload;
  }
  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.cancalEvent.emit();
  }
  back() {
    this.cancalEvent.emit();
  }

  getFormatLabel() {
    return this.isRTL() ? 'lookupNameAr' : 'lookupNameEn'
  }
}
