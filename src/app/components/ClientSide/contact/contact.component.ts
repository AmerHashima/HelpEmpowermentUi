// src\app\components\contact\contact.component.ts
import { Component, inject } from '@angular/core';
import { PageBannerComponent } from '../../../shared/clientSide/page-banner/page-banner.component';
import { Shared } from '../../../shared/Services/shared/shared';
import { TextareaComponent } from '../../../shared/text-area/text-area.component';
import { NgxsmkTelInputComponent } from 'ngxsmk-tel-input';
import { InputComponent } from '../../../shared/input/input.component';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone:true,
  imports: [PageBannerComponent,TextareaComponent,NgxsmkTelInputComponent,InputComponent,
    SiteButtonComponent,FormsModule,TranslateModule,TranslatePipe,NgIf
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
private shared=inject(Shared);
isRTL=this.shared.isRtl;

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
  contact = {
    fullName: '',
    email: '',
    phone: "",
    message: '',
  };

  onSendContactMessage() {
    console.log('Submitted credentials:', this.contact);
  }
}
