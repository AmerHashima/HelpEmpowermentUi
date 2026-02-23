// src\app\components\ClientSide\contact\contact.component.ts
import { Component, computed, inject, signal } from '@angular/core';
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
  private shared = inject(Shared);
  private auth = inject(AuthService);
  private contactService = inject(ContactUsService);
  private translationService = inject(TranslateService);
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
      value: 'Media City, UAE'
    },
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


  private sanitizer = inject(DomSanitizer);

  private readonly embedSrc =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.5!2d55.150!3d25.090!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496b0b!2sDubai+Media+City!5e0!3m2!1sen!2sae!4v1730000000000';

  readonly mapUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.embedSrc)
  );

  onSendContactMessage(form: NgForm) {

    if (this.student() && this.student()?.userId) {
      if (form.invalid) {
        Object.values(form.controls).forEach(control => {
          control.markAsTouched();
        });
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
          contactTypeLookupId: '26aead15-8169-49ae-8929-29c3f3f6ad56',
          studentId: this.student()?.userId!
        };

        this.contactService.createContactMessage(payload).subscribe({
          next: () => {
            form.resetForm();
          },
          error: () => {
            console.error('Error sending message');
          }
        });

      });
    } else {
      this.showConfirm = true;
    }
  }


}
