// src\app\components\ClientSide\contact\contact.component.ts
import { Component, computed, effect, inject, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { PageBannerComponent } from '../../../shared/clientSide/page-banner/page-banner.component';
import { Shared } from '../../../shared/Services/shared/shared';
import { TextareaComponent } from '../../../shared/text-area/text-area.component';
import { InputComponent } from '../../../shared/input/input.component';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ContactCardComponent } from './contact-card/contact-card.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PhoneInputComponent } from '../../../shared/phone/phone.component';
import { AuthService } from '../../../Services/auth.service';
import { TranslateService } from '../../../Services/translate.service';
import { forkJoin } from 'rxjs';
import { ContactUsService } from '../../../Services/contact-us.service';
import { GenericModelComponent } from '../../../shared/generic-model/generic-model.component';
import { ToastingMessagesService } from '../../../shared/Services/ToastingMessages/toasting-messages.service';
import { generalContactLookUp } from '../../../data/lookUPS';
interface ContactInfo {
  icon: string;
  header: string;
  value?: string;
}
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [PageBannerComponent, TextareaComponent, InputComponent,
    SiteButtonComponent, FormsModule, TranslateModule, TranslatePipe, ContactCardComponent,
    PhoneInputComponent, GenericModelComponent
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  @ViewChildren(PhoneInputComponent)
  phoneCmps!: QueryList<PhoneInputComponent>;
    private shared = inject(Shared);
  private auth = inject(AuthService);
  private contactService = inject(ContactUsService);
  private translationService = inject(TranslateService);
  private toasting = inject(ToastingMessagesService);
  formSubmitted = false;
  student = this.auth.loggedStudent;
  isRTL = this.shared.isRtl;
  showConfirm: boolean = false;
  readonly contactInfos = signal<ContactInfo[]>([
    {
      icon: '',
      header: 'Contact US',
      value: undefined
    },
    {
      icon: 'bi bi-envelope',
      header: 'Email Us',
      value: 'Support@helpempowerment.com'
    },
    {
      icon: 'bi bi-geo-alt',
      header: 'Visit Us',
      value: 'Media City, UAE'    },
    {
      icon: '',
      header: '',
      value: undefined
    }
  ]);

  contact = {
    fullName: '',
    email: '',
    phone: "",
    message: '',
  };


  constructor() {
    effect(() => this.patchUserData());
  }
  private patchUserData() {
    const user = this.student();

    if (user) {
      this.contact.fullName = user.nameEn;
      this.contact.email = user.email || '';
      this.contact.phone = user.mobile || '';
    }
  }
  private sanitizer = inject(DomSanitizer);



  private readonly embedSrc =
    'https://www.google.com/maps?q=Sharjah,United+Arab+Emirates&output=embed';

  readonly mapUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.embedSrc)
  );

  onSendContactMessage(form: NgForm) {
    if (this.student() && this.student()?.userId) {
      if (form.invalid) {
        Object.values(form.controls).forEach(control => {
          control.markAsTouched();
        });
        this.phoneCmps?.forEach(c => c.validateOnSubmit());
        return;
      }

      forkJoin({
        fullNameAr: this.translationService.translateEnToAr(this.contact.fullName),
        messageAr: this.translationService.translateEnToAr(this.contact.message)
      }).subscribe(translations => {

        const payload = {
          fullName: this.contact.fullName,
          fullNameAr: translations.fullNameAr,
          email: this.contact.email,
          phone: '',
          mobile: this.contact.phone,
          subject: '',
          subjectAr: '',
          message: this.contact.message,
          messageAr: translations.messageAr,
          contactTypeLookupId:generalContactLookUp,
          // contactTypeLookupId: '26aead15-8169-49ae-8929-29c3f3f6ad56',
          studentId: this.student()?.userId!
        };

        this.contactService.createContactMessage(payload).subscribe({
          next: () => {
            form.resetForm({
              fullName: this.student()?.nameEn || '',
              email: this.student()?.email || '',
              phone: this.student()?.mobile || '',
              message: ''
            });
            this.phoneCmps?.forEach(c => c.resetState());
          },
          error: (err) => {

            const apiMessage =
              err?.error?.message ||
              err?.error?.errors?.[0] ||
              'contact.error.sendMessage';

            this.toasting.showToast(apiMessage, 'error');
          },
          // error: () => {
          //   console.error('Error sending message');
          // }
        });

      });
    } else {
      this.showConfirm = true;
    }
  }


}
