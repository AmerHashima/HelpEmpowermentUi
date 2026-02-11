import { Component, inject } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxsmkTelInputComponent } from 'ngxsmk-tel-input';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone:true,
  imports: [SiteButtonComponent,InputComponent,TranslateModule,
    TranslatePipe, RouterLink, FormsModule, NgxsmkTelInputComponent,NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;
  lang=this.shared.lang;

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
  credentials = {
    firstName: '',
    lastName: '',
    email:'',
    phone:"",
    password: '',
    confirmPassword:'',
    terms: false
  };

  onRegister() {
    console.log('Submitted credentials:', this.credentials);
  }
}
