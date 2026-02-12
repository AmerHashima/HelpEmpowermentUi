import { Component, inject, output } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { TextareaComponent } from '../../../../shared/text-area/text-area.component';
import { FormsModule } from '@angular/forms';
import { PhoneInputComponent } from '../../../../shared/phone/phone.component';

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
  isRTL=this.shared.isRtl;
  readonly submitted = output<any>();


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

  onEnroll() {
    console.log('Enroll form submitted:', this.enroll);
    this.submitted.emit(this.enroll);
  }
}
