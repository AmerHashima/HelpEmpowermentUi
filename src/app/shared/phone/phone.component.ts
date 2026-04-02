// import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, forwardRef, inject, Input, signal, ViewChild } from '@angular/core';
// import {  NgIf } from '@angular/common';
// import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
// import { NgxsmkTelInputComponent } from 'ngxsmk-tel-input';
// import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
// import { Shared } from '../Services/shared/shared';
// import { COUNTRIES_AR } from '../../data/countries';
// @Component({
//   selector: 'app-phone-input',
//   standalone: true,
//   imports: [
//     TranslateModule,
//     TranslatePipe,
//     NgxsmkTelInputComponent,
//     FormsModule,
//     NgIf
//   ],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => PhoneInputComponent),
//       multi: true
//     }
//   ],
//   templateUrl: './phone.component.html',
//   styleUrl: './phone.component.scss'
// })
// export class PhoneInputComponent implements ControlValueAccessor {
//   @ViewChild(NgxsmkTelInputComponent)
//   phoneInputComponent!: NgxsmkTelInputComponent;

//   private shared = inject(Shared);

//   isRTL = this.shared.isRtl;

//   @Input() labelKey = '';
//   @Input() required = true;



//   readonly preferredCountries: any[] = [ 'EG', 'AE', 'US'];
//   readonly initialCountry = 'SA';

//   readonly arabicLabels = {
//     searchPlaceholder: 'ابحث عن دولة أو رمز الاتصال',
//     noCountrySelected: 'لم يتم اختيار دولة',
//     noResultsFound: 'لا توجد نتائج',
//     selectCountry: 'اختر الدولة'
//   };

//   readonly arabicCountries = COUNTRIES_AR;

//   value: string = '';
//   disabled = false;



//   ngAfterViewInit() {
//     setTimeout(() => {
//       this.phoneInputComponent?.selectCountry('SA');
//     }, 100);
//   }



//   onChange: (val: string) => void = () => { };
//   onTouched: () => void = () => { };




//   writeValue(value: string): void {
//     this.value = value || '';
//   }




//   registerOnChange(fn: any): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: any): void {
//     this.onTouched = fn;
//   }

//   setDisabledState(isDisabled: boolean): void {
//     this.disabled = isDisabled;
//   }

//   onValueChange(newValue: string) {
//     this.value = newValue;
//     this.onChange(newValue);
//     this.onTouched();
//   }


// }
import {
  Component,
  ElementRef,
  forwardRef,
  inject,
  Input,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import intlTelInput from 'intl-tel-input';
import { Shared } from '../Services/shared/shared';
import { COUNTRIES_AR } from '../../data/countries';
import { NgIf } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports:[NgIf],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true
    }
  ]
})
export class PhoneInputComponent
  implements ControlValueAccessor, AfterViewInit {
  @ViewChild('phoneInput', { static: true })
  input!: ElementRef<HTMLInputElement>;

  private shared = inject(Shared);
  private platformId = inject(PLATFORM_ID);
  isRTL = this.shared.isRtl;

  @Input() labelKey = '';
  @Input() required = true;

  iti: any;
  value: string = '';

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.iti = intlTelInput(this.input.nativeElement, {
      initialCountry: 'sa',
      preferredCountries: ['eg', 'ae', 'us'],
      separateDialCode: true,
      utilsScript:
        'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js'
    } as any);

    // 🔥 Apply Arabic names after dropdown opens
    this.input.nativeElement.addEventListener('open:countrydropdown', () => {
      this.translateCountries();
    });
  }

  //  Arabic Translation (REAL)
  translateCountries() {
    if (!this.isRTL()) return;

    setTimeout(() => {
      const items = document.querySelectorAll('.iti__country');

      items.forEach((item: any) => {
        const code = item.getAttribute('data-country-code');
        const nameEl = item.querySelector('.iti__country-name');

        if (!code || !nameEl) return;

        const ar = COUNTRIES_AR[code.toLowerCase()];

        if (ar) {
          nameEl.textContent = ar;
        }
      });
    }, 0);
  }

  // ControlValueAccessor
  onChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: string): void {
    this.value = value || '';
    if (this.iti) {
      this.iti.setNumber(this.value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput() {
    const number = this.iti.getNumber();
    this.value = number;
    this.onChange(number);
  }


}
