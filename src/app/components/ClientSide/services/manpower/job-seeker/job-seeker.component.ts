// src\app\components\ClientSide\services\manpower\job-seeker\job-seeker.component.ts
import { Component, effect, inject, QueryList, ViewChildren } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { InputComponent } from '../../../../../shared/input/input.component';
import { FileUploadComponent } from '../../../../../shared/file-upload/file-upload.component';
import { Shared } from '../../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../../shared/clientSide/site-button/site-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { SpkNgSelectComponent } from '../../../../../shared/spk-ng-select/spk-ng-select.component';
import { PhoneInputComponent } from '../../../../../shared/phone/phone.component';
import { ContactUsService } from '../../../../../Services/contact-us.service';
import { AuthService } from '../../../../../Services/auth.service';
import { ToastingMessagesService } from '../../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { JobSeekerContactLookUp } from '../../../../../data/lookUPS';
import { GenericModelComponent } from '../../../../../shared/generic-model/generic-model.component';

@Component({
  selector: 'app-job-seeker',
  imports: [TranslateModule, TranslatePipe, InputComponent,
    FileUploadComponent, SiteButtonComponent, FormsModule, PhoneInputComponent, SpkNgSelectComponent, GenericModelComponent
  ], templateUrl: './job-seeker.component.html',
  styleUrl: './job-seeker.component.scss'
})
export class JobSeekerComponent {
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;
  @ViewChildren(PhoneInputComponent)
  phoneCmps!: QueryList<PhoneInputComponent>;
  showConfirm = false;
  private contactService = inject(ContactUsService);
  private auth = inject(AuthService);
  private toasting = inject(ToastingMessagesService);
  student = this.auth.loggedStudent;


  experiences = [
    { oid: 'exp-001', name: 'Internship' },
    { oid: 'exp-002', name: 'Junior Level (0–2 years)' },
    { oid: 'exp-003', name: 'Mid-Level (2–5 years)' },
    { oid: 'exp-004', name: 'Senior Level (5–8 years)' },
    { oid: 'exp-005', name: 'Lead / Team Lead (8+ years)' },
    { oid: 'exp-006', name: 'Managerial Level' },
    { oid: 'exp-007', name: 'Director / Executive Level' }
  ];
  job = {
    fullname: '',
    field: '',
    email: '',
    phone: "",
    currentPosition: '',
    experience: '',
    currentSalary: '',
    expectedSalary: '',
    attachments: [],
  };

  constructor() {
    effect(() => this.patchUserData());
  }
  private patchUserData() {
    const user = this.student();

    if (user) {
      this.job.fullname = user.nameEn;
      this.job.email = user.email || '';
      this.job.phone = user.mobile || '';
    }
  }
  onPostJob(form: NgForm) {
    if (this.student() && this.student()?.userId) {

      if (form.invalid) {
        Object.values(form.controls).forEach(control => {
          control.markAsTouched();
        });
        this.phoneCmps?.forEach(c => c.validateOnSubmit());
        return;
      }

      const payload = {
        fullName: this.job.fullname,
        fullNameAr: this.job.fullname,
        email: this.job.email,
        phone: '',
        mobile: this.job.phone,
        subject: '',
        subjectAr: '',
        message: this.getJobSeekerMessage(),
        messageAr: this.getJobSeekerMessage(),
        contactTypeLookupId: JobSeekerContactLookUp,
        studentId: this.student()?.userId!
      };
      const hasAttachment=this.job.attachments?.[0]?true:false;
      this.contactService.createContactMessage(payload, 'jobSeeker',hasAttachment).subscribe({
        // next: () => {
        //   form.resetForm({
        //     fullname: this.student()?.nameEn || '',
        //     email: this.student()?.email || '',
        //     message: ''
        //   });
        //   this.phoneCmps?.forEach(c => c.resetState());
        // },
        next: (res: any) => {

          const contactId = res?.data?.oid || res?.oid || res?.id;

          const attachment = this.job.attachments?.[0];

          // NO FILE

          if (!attachment) {

            this.handleSuccess(form);

            return;

          }

          // UPLOAD FILE

          this.contactService.uploadAttachment(contactId, attachment).subscribe({

              next: () => {

                this.handleSuccess(form);

              },

              error: (err:any) => {


                this.toasting.showToast(

                  'Attachment upload failed',

                  'error'

                );

              }

            });

        },
        error: (err) => {

          const apiMessage =
            err?.error?.message ||
            err?.error?.errors?.[0] ||
            'job.error';

          this.toasting.showToast(apiMessage, 'error');
        },

      });

    } else {
      this.showConfirm = true;
    }

  }

  private handleSuccess(form: NgForm) {

    this.toasting.showToast(

      'Application submitted successfully',

      'success'

    );

    form.resetForm({

      fullname: this.student()?.nameEn || '',

      email: this.student()?.email || '',

      phone: this.student()?.mobile || ''

    });

    this.job.attachments = [];

    this.phoneCmps?.forEach(c => c.resetState());

  }

  getJobSeekerMessage() {
    const j = this.job;

    const val = (v: any) => v ? v : '-';

    return `Job application request

Field: ${val(j.field)}
Current Position: ${val(j.currentPosition)}
Experience: ${val(j.experience)}
Current Salary: ${val(j.currentSalary)}
Expected Salary: ${val(j.expectedSalary)}`;
  }
}
