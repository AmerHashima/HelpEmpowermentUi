// src\app\components\ClientSide\services\manpower\post-vacnacy\post-vacnacy.component.ts
import { Component, effect, inject, QueryList, ViewChildren } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { InputComponent } from '../../../../../shared/input/input.component';
import { TextareaComponent } from '../../../../../shared/text-area/text-area.component';
import { FileUploadComponent } from '../../../../../shared/file-upload/file-upload.component';
import { Shared } from '../../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../../shared/clientSide/site-button/site-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { SpkNgSelectComponent } from '../../../../../shared/spk-ng-select/spk-ng-select.component';
import { PhoneInputComponent } from '../../../../../shared/phone/phone.component';
import { ToastingMessagesService } from '../../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { ContactUsService } from '../../../../../Services/contact-us.service';
import { AuthService } from '../../../../../Services/auth.service';
import { GenericModelComponent } from '../../../../../shared/generic-model/generic-model.component';
import { PostVacancyContactLookUp } from '../../../../../data/lookUPS';

@Component({
  selector: 'app-post-vacnacy',
  standalone: true,
  imports: [TranslateModule, TranslatePipe, InputComponent, TextareaComponent,
    FileUploadComponent, SiteButtonComponent, FormsModule, PhoneInputComponent, SpkNgSelectComponent, GenericModelComponent
  ],
  templateUrl: './post-vacnacy.component.html',
  styleUrl: './post-vacnacy.component.scss'
})
export class PostVacnacyComponent {
  @ViewChildren(PhoneInputComponent)
  phoneCmps!: QueryList<PhoneInputComponent>;
  private shared = inject(Shared);
  private toasting = inject(ToastingMessagesService);
  private contactService = inject(ContactUsService);
  private auth = inject(AuthService);
  student = this.auth.loggedStudent;
  showConfirm = false;
  isRTL = this.shared.isRtl;

  experiences = [
    { oid: 'exp-001', name: 'Internship' },
    { oid: 'exp-002', name: 'Junior Level (0–2 years)' },
    { oid: 'exp-003', name: 'Mid-Level (2–5 years)' },
    { oid: 'exp-004', name: 'Senior Level (5–8 years)' },
    { oid: 'exp-005', name: 'Lead / Team Lead (8+ years)' },
    { oid: 'exp-006', name: 'Managerial Level' },
    { oid: 'exp-007', name: 'Director / Executive Level' }
  ];
  vacancy = {
    fullname: '',
    companyName: '',
    email: '',
    phone: "",
    role: '',
    experience: '',
    jobDescription: '',
    attachments: [],
    notes: ""
  };

  constructor() {
    effect(() => this.patchUserData());
  }
  private patchUserData() {
    const user = this.student();

    if (user) {
      this.vacancy.fullname = user.nameEn;
      this.vacancy.email = user.email || '';
      this.vacancy.phone = user.mobile || '';
    }
  }
  onPostVacancy(form: NgForm) {
    if (this.student() && this.student()?.userId) {
      if (form.invalid) {
        Object.values(form.controls).forEach(control => {
          control.markAsTouched();
        });
        this.phoneCmps?.forEach(c => c.validateOnSubmit());
        return;
      }

      const payload = {
        fullName: this.vacancy.fullname,
        fullNameAr: this.vacancy.fullname,
        email: this.vacancy.email,
        phone: '',
        mobile: this.vacancy.phone,
        subject: '',
        subjectAr: '',
        message: this.getPostVacancyMessage(),
        messageAr: this.getPostVacancyMessage(),
        contactTypeLookupId: PostVacancyContactLookUp,
        studentId: this.student()?.userId!
      };

      this.contactService.createContactMessage(payload).subscribe({
        next: () => {
          form.resetForm({
            fullname: this.student()?.nameEn || '',
            email: this.student()?.email || '',
            // phone: this.student()?.mobile || '',
            message: ''
          });
          this.phoneCmps?.forEach(c => c.resetState());
        },
        error: (err) => {

          const apiMessage =
            err?.error?.message ||
            err?.error?.errors?.[0] ||
            'vacancy.error';

          this.toasting.showToast(apiMessage, 'error');
        },

      });
    } else {
      this.showConfirm = true;
    }
  }

  getPostVacancyMessage() {
    const v = this.vacancy;

    const val = (x: any) => x ? x : '-';

    return `Post vacancy request

Company: ${val(v.companyName)}
Email: ${val(v.email)}
Phone: ${val(v.phone)}

Role: ${val(v.role)}
Experience: ${val(v.experience)}

Job Description:
${val(v.jobDescription)}

Notes:
${val(v.notes)}`;
  }



}



