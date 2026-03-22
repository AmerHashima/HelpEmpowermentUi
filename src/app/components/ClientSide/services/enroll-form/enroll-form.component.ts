// src\app\components\ClientSide\services\enroll-form\enroll-form.component.ts
import { Component, inject, input, output } from '@angular/core';
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

@Component({
  selector: 'app-enroll-form',
  imports: [TranslateModule,TranslatePipe,SiteButtonComponent,InputComponent,
    TextareaComponent,FormsModule,PhoneInputComponent
  ],
  templateUrl: './enroll-form.component.html',
  styleUrl: './enroll-form.component.scss'
})
export class EnrollFormComponent {
  private shared=inject(Shared);
  private toasting=inject(ToastingMessagesService);
  isRTL=this.shared.isRtl;
  readonly submitted = output<any>();
  page=input<string>('');

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
    organizationname:"",
    email: '',
    phone: "",
    notes: '',
  };



  // Replace your current onEnroll with this version
  async onEnroll(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    const enrollMessageData = {
      ...this.enroll,
      service: this.page() || 'unknown',
    };

    console.log('Sending enroll data:', enrollMessageData);

    try {
      const response: EmailJSResponseStatus = await emailjs.send(
        environment.mailServiceId,
        environment.mailTemolateId,
        enrollMessageData,
        {
          publicKey: environment.mailPublicKey
        }
      );

      console.log('SUCCESS!', response.status, response.text);

      // this.sendSuccess = true;
      // this.submitted.emit(enrollMessageData);  // keep your original output if needed
       this.toasting.showToast('enroll.sent.success','success');
      // Optional: reset form after success
      // this.enroll = {
      //   fullname: '',
      //   organizationname: "",
      //   email: '',
      //   phone: "",
      //   notes: '',
      // };
      form.resetForm();   // clears touched state too

    } catch (err: any) {
      this.toasting.showToast("enroll.sent.error", 'error');
      // console.error('EmailJS failed:', err);
      // this.sendError = 'فشل إرسال الطلب. حاول مرة أخرى أو تواصل معنا مباشرة.';
    }
    //  finally {
    //   this.isSending = false;
    // }
  }

  // onEnroll(form:NgForm) {
  //   if (form.invalid) {
  //     Object.values(form.controls).forEach(control => {
  //       control.markAsTouched();
  //     });
  //     return;
  //   }
  //   const enrollMessageData={
  //     ...this.enroll,
  //     service:this.page()
  //   }
  //   console.log('enroll Data', enrollMessageData);
  //   // this.submitted.emit(this.enroll);
  // }
}
