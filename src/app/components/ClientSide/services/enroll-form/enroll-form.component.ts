// src\app\components\ClientSide\services\enroll-form\enroll-form.component.ts
import { Component, effect, inject, input, output, QueryList, ViewChildren } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { TextareaComponent } from '../../../../shared/text-area/text-area.component';
import { FormsModule, NgForm } from '@angular/forms';
import { PhoneInputComponent } from '../../../../shared/phone/phone.component';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../Services/auth.service';
import { firstValueFrom, forkJoin } from 'rxjs';
import { ContactUsService } from '../../../../Services/contact-us.service';
import { serviceEnrollMessageingLookup } from '../../../../data/lookUPS';
import { TranslateService } from '../../../../Services/translate.service';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { LoadingService } from '../../../../shared/Services/Loading/loading.service';

@Component({
  selector: 'app-enroll-form',
  imports: [TranslateModule, TranslatePipe, SiteButtonComponent, InputComponent,
    TextareaComponent, FormsModule, PhoneInputComponent, GenericModelComponent
  ],
  templateUrl: './enroll-form.component.html',
  styleUrl: './enroll-form.component.scss'
})
export class EnrollFormComponent {
  @ViewChildren(PhoneInputComponent)
  phoneCmps!: QueryList<PhoneInputComponent>;
  private shared = inject(Shared);
  private contactService = inject(ContactUsService);
  private auth = inject(AuthService);
  private translationService = inject(TranslateService);
  private loader=inject(LoadingService);
  student = this.auth.loggedStudent;
  private toasting = inject(ToastingMessagesService);
  isRTL = this.shared.isRtl;
  readonly submitted = output<any>();
  showConfirm = false;
  page = input<string>('');

  arabicLabels = {
    searchPlaceholder: 'ابحث عن دولة أو رمز الاتصال',
    noCountrySelected: 'لم يتم اختيار دولة',
    noResultsFound: 'لا توجد نتائج',
    selectCountry: 'اختر الدولة'
  };

  arabicCountries = {
    EG: 'مصر',
    SA: 'السعودية',
    AE: 'الإمارات العربية المتحدة',
    US: 'الولايات المتحدة الأمريكية'
  }
  enroll = {
    fullname: '',
    organizationname: "",
    email: '',
    phone: "",
    notes: '',
  };


  constructor() {
    effect(() => {
      const user = this.student();

      if (user) {
        this.enroll.fullname = user.nameEn;
        this.enroll.email = user.email || '';
        this.enroll.phone = user.mobile || '';
      }
    });
  }

  async onEnroll(form: NgForm) {
    if (this.student() && this.student()?.userId) {

      if (form.invalid) {
        Object.values(form.controls).forEach(control => {
          control.markAsTouched();
        });
        this.phoneCmps?.forEach(c => c.validateOnSubmit());
        return;
      }

      try {
        // 🔹 1. Translations
        const translations = await firstValueFrom(
          forkJoin({
            fullNameAr: this.translationService.translateEnToAr(this.enroll.fullname),
            messageAr: this.translationService.translateEnToAr(
              `Enroll request for ${this.page()}`
            )
          })
        );

        const payload = {
          fullName: this.enroll.fullname,
          fullNameAr: translations.fullNameAr,
          email: this.enroll.email,
          phone: '',
          mobile: this.enroll.phone,
          subject: '',
          subjectAr: '',
          message: `Enroll request for ${this.page()} ,\n Working at :${this.enroll.organizationname} \n Notes: ${this.enroll.notes}`,
          messageAr: translations.messageAr,
          contactTypeLookupId: serviceEnrollMessageingLookup,
          studentId: this.student()?.userId!
        };

        const enrollMessageData = {
          ...this.enroll,
          service: this.page() || 'unknown',
        };


        await firstValueFrom(
          this.contactService.createContactMessage(payload, 'enroll')
        );

        try {
          this.loader.start();
          await emailjs.send(
            environment.mailServiceId,
            environment.mailTemolateId,
            enrollMessageData,
            { publicKey: environment.mailPublicKey }
          );
        } catch (emailError) {
          this.toasting.showToast('enroll.email.failed', 'warning');
        }
        finally {
          this.loader.stop();
        }

        this.toasting.showToast('enroll.sent.success', 'success');
        form.resetForm({
          fullname: this.student()?.nameEn || '',
          email: this.student()?.email || '',
          phone: this.student()?.mobile || '',
          message: ''
        });

        this.phoneCmps?.forEach(c => c.resetState());

      }
      catch (apiError: any) {

        const apiMessage =
          apiError?.error?.message ||
          apiError?.error?.errors?.[0] ||
          'enroll.sent.error';

        this.toasting.showToast(apiMessage, 'error');
      }

    } else {
      this.showConfirm = true;
    }
  }

  // async onEnroll(form: NgForm) {
  //   if (this.student() && this.student()?.userId) {

  //     if (form.invalid) {
  //       Object.values(form.controls).forEach(control => {
  //         control.markAsTouched();
  //       });
  //       this.phoneCmps?.forEach(c => c.validateOnSubmit());
  //       return;
  //     }

  //     try {
  //       const translations = await firstValueFrom(
  //         forkJoin({
  //           fullNameAr: this.translationService.translateEnToAr(this.enroll.fullname),
  //           messageAr: this.translationService.translateEnToAr(
  //             `Enroll request for ${this.page()}`
  //           )
  //         })
  //       );

  //       const payload = {
  //         fullName: this.enroll.fullname,
  //         fullNameAr: translations.fullNameAr,
  //         email: this.enroll.email,
  //         phone: '',
  //         mobile: this.enroll.phone,
  //         subject: '',
  //         subjectAr: '',
  //         message: `Enroll request for ${this.page()}`,
  //         messageAr: translations.messageAr,
  //         contactTypeLookupId: serviceEnrollMessageingLookup,
  //         studentId: this.student()?.userId!
  //       };

  //       const enrollMessageData = {
  //         ...this.enroll,
  //         service: this.page() || 'unknown',
  //       };

  //       await Promise.all([
  //         emailjs.send(
  //           environment.mailServiceId,
  //           environment.mailTemolateId,
  //           enrollMessageData,
  //           { publicKey: environment.mailPublicKey }
  //         ),
  //         firstValueFrom(this.contactService.createContactMessage(payload))
  //       ]);

  //       this.toasting.showToast('enroll.sent.success', 'success');

  //       form.resetForm({
  //         fullName: this.student()?.nameEn || '',
  //         email: this.student()?.email || '',
  //         phone: this.student()?.mobile || '',
  //         message: ''
  //       });

  //       this.phoneCmps?.forEach(c => c.resetState());

  //     } catch (err) {
  //       console.error('Enroll error:', err);
  //       this.toasting.showToast('enroll.sent.error', 'error');
  //     }

  //   } else {
  //     this.showConfirm = true;
  //   }
  // }
}
