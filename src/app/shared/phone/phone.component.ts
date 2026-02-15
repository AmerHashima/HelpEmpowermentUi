import { Component, CUSTOM_ELEMENTS_SCHEMA, forwardRef, inject, Input } from '@angular/core';
import {  NgIf } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { NgxsmkTelInputComponent } from 'ngxsmk-tel-input';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Shared } from '../Services/shared/shared';
@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [
    TranslateModule,
    TranslatePipe,
    NgxsmkTelInputComponent,
    FormsModule,
    NgIf
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true
    }
  ],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.scss'
})
export class PhoneInputComponent implements ControlValueAccessor {
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;

  @Input() labelKey = '';  // still overridable if needed
  @Input() required = true;


  // ────────────────────────────────────────────────
  readonly preferredCountries: any[] = ['EG', 'SA', 'AE', 'US'];
  readonly initialCountry = 'EG';

  readonly arabicLabels = {
    searchPlaceholder: 'ابحث عن دولة أو رمز الاتصال',
    noCountrySelected: 'لم يتم اختيار دولة',
    noResultsFound: 'لا توجد نتائج',
    selectCountry: 'اختر الدولة'
  };

  readonly arabicCountries = {
    EG: 'مصر',
    SA: 'السعودية',
    AE: 'الإمارات العربية المتحدة',
    US: 'الولايات المتحدة الأمريكية'
  };

  value: string = '';
  disabled = false;

  onChange: (val: string) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(newValue: string) {
    this.value = newValue;
    this.onChange(newValue);
    this.onTouched();
  }
}
