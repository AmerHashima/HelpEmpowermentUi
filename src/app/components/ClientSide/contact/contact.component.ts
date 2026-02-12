// src\app\components\contact\contact.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { PageBannerComponent } from '../../../shared/clientSide/page-banner/page-banner.component';
import { Shared } from '../../../shared/Services/shared/shared';
import { TextareaComponent } from '../../../shared/text-area/text-area.component';
import { InputComponent } from '../../../shared/input/input.component';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ContactCardComponent } from './contact-card/contact-card.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PhoneInputComponent } from '../../../shared/phone/phone.component';
interface ContactInfo {
  icon: string;
  header: string;
  value?: string;
}
@Component({
  selector: 'app-contact',
  standalone:true,
  imports: [PageBannerComponent,TextareaComponent,InputComponent,
    SiteButtonComponent,FormsModule,TranslateModule,TranslatePipe,ContactCardComponent,
    PhoneInputComponent
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
private shared=inject(Shared);
isRTL=this.shared.isRtl;

  readonly contactInfos = signal<ContactInfo[]>([
    {
      icon: 'bi bi-phone',
      header: 'Call Us',
      value: '0122 456 7890'
    },
    {
      icon: 'bi bi-envelope',
      header: 'Email Us',
      value: 'support@yourcompany.com'
    },
    {
      icon: 'bi bi-map-marker',
      header: 'Visit Us',
      value: '123 Main Street, Cairo'
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

  private readonly embedSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.423456789!2d-0.127586!3d51.507351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5b2a4c3f1!2sLondon!5e0!3m2!1sen!2suk!4v1700000000000';

  readonly mapUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.embedSrc)
  );

  onSendContactMessage() {
    console.log('Submitted credentials:', this.contact);
  }
}
