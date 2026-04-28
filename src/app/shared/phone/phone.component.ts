


import {
  Component,
  ElementRef,
  forwardRef,
  inject,
  Input,
  ViewChild,
  AfterViewInit,
  PLATFORM_ID,
  computed
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import intlTelInput from 'intl-tel-input';
import { Shared } from '../Services/shared/shared';
import { COUNTRIES_AR } from '../../data/countries';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [NgIf, TranslatePipe],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true
    }
  ]
})
export class PhoneInputComponent  implements ControlValueAccessor, AfterViewInit, Validator {

private cdr = inject(ChangeDetectorRef);
  @ViewChild('phoneInput', { static: true })
  input!: ElementRef<HTMLInputElement>;

  private shared = inject(Shared);
  private platformId = inject(PLATFORM_ID);

  isRTL = this.shared.isRtl;

  @Input() labelKey = '';
  @Input() required = true;

  iti: any;
  value: string = '';
  placeholder = '';
  isValid = true;
  touched = false;

  private pendingValue: string | null = null;
  private onValidatorChange = () => { };
  get rawValue(): string {
    return this.input?.nativeElement?.value || '';
  }


  // ================= INIT =================
  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.iti = intlTelInput(this.input.nativeElement, {
      initialCountry: 'sa',
      preferredCountries: ['eg', 'ae', 'us'],
      separateDialCode: true,
      utilsScript: '/assets/utils.js'
    });

    // 🔥 CRITICAL FIX
    Promise.resolve().then(() => {
      if (!this.value) {
        this.iti.setCountry('sa');
      }
    });


    if (this.pendingValue) {
      this.iti.setNumber(this.pendingValue);

      this.isValid = this.iti.isValidNumber();

      this.onChange(this.iti.getNumber());

      this.onValidatorChange();

      this.pendingValue = null;
    }

    this.updatePlaceholder();

    this.input.nativeElement.addEventListener('countrychange', () => {
      this.updatePlaceholder();
    });

    this.input.nativeElement.addEventListener('open:countrydropdown', () => {
      this.translateCountries();
      // this.translateSearchPlaceholder();
    });
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  // validate(control: AbstractControl): ValidationErrors | null {
  //   if (!this.value) {
  //     return { required: true };
  //   }

  //   if (!this.isValid) {
  //     return { invalidPhone: true };
  //   }

  //   return null;
  // }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required && !this.value) {
      return { required: true };
    }

    if (!this.required && !this.value) {
      return null;
    }

    if (!this.isValid) {
      return { invalidPhone: true };
    }

    return null;
  }

  updatePlaceholder() {
      if (!this.iti) return;

      const { iso2 } = this.iti.getSelectedCountryData();

      const patterns: Record<string, string> = {
        // 🌍 الدول العربية
        eg: '010xxxxxxxx',
        sa: '05xxxxxxxx',
        ae: '05xxxxxxxx',
        kw: '5xxxxxxxx',
        qa: '3xxxxxxxx',
        om: '9xxxxxxxx',
        bh: '3xxxxxxxx',
        lb: '7xxxxxxxx',
        ma: '06xxxxxxxx',
        dz: '05xxxxxxxx',
        ye: '7xxxxxxxx',

        // 🌍 أوروبا
        fr: '06xxxxxxxx',
        de: '015xxxxxxxx',
        es: '6xxxxxxxx',
        it: '3xxxxxxxx',
        nl: '06xxxxxxxx',
        se: '07xxxxxxxx',
        ch: '07xxxxxxxx',

        // 🌍 أمريكا
        us: '2015550123',
        ca: '2042345678',
        br: '11987654321',
        ar: '91123456789',

        // 🌍 آسيا
        tr: '05xxxxxxxx',
        in: '09123456789',
        cn: '13123456789',
        jp: '09012345678',
        bd: '018xxxxxxxx',

        // 🌍 أخرى
        au: '0412345678',
        at: '06641234567',
        be: '0470123456',
        az: '0501234567',
        am: '091234567'
      };

      if (patterns[iso2]) {
        this.placeholder = patterns[iso2];
      } else {
        this.placeholder = 'XXXXXXXX';
      }
    this.cdr.detectChanges();
    }


  onChange = (_: any) => { };
  onTouched = () => { };



  writeValue(value: string): void {
    console.log('API value:', this.value);
    console.log('Formatted:', this.iti.getNumber());
    console.log('Is valid:', this.iti.isValidNumber());
    console.log('Country:', this.iti.getSelectedCountryData());
    this.value = value || '';

    if (!this.value) return;

    if (this.iti) {
      this.iti.setNumber(this.value);

      this.isValid = this.iti.isValidNumber();

      this.onChange(this.iti.getNumber());

      // 🔥 THIS LINE FIXES YOUR ISSUE
      this.onValidatorChange();
    } else {
      this.pendingValue = this.value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // ================= INPUT =================

  onInput() {
    if (!this.iti) return;

    this.touched = true;

    const raw = this.input.nativeElement.value.trim();
    this.value = raw;

    if (!raw) {
      this.isValid = false;
      this.onChange('');
      return;
    }

    // ✅ light validation during typing
    this.isValid = raw.length >= 6;

    this.onChange(this.value);
  }

  onBlur() {
    this.onTouched();

    if (!this.iti) return;

    if (this.iti.isValidNumber()) {
      const full = this.iti.getNumber();

      this.isValid = true;
      this.onChange(full);
    } else {
      this.isValid = false;
    }

    this.onValidatorChange();
  }



  translateCountries() {
    setTimeout(() => {
      const items = document.querySelectorAll('.iti__country');

      items.forEach((item: any) => {
        const code = item.getAttribute('data-country-code');
        const nameEl = item.querySelector('.iti__country-name');

        if (!code || !nameEl) return;

        if (this.isRTL()) {
          const ar = COUNTRIES_AR[code.toLowerCase()];
          if (ar) nameEl.textContent = ar;
        } else {
          const original = nameEl.getAttribute('data-original-name');

          if (original) {
            nameEl.textContent = original;
          } else {
            nameEl.setAttribute('data-original-name', nameEl.textContent);
          }
        }
      });
    });
  }

  validateOnSubmit() {
    console.log('validateOnSubmit');
    const raw = this.input.nativeElement.value.trim();

    this.value = raw;
     console.log('value',raw);
    if (!raw) {
      this.isValid = false;
    } else {
      this.isValid = raw.length >= 6;
    }

    this.touched = true;

    this.onValidatorChange();
    this.cdr.detectChanges();
  }


  resetState() {
    this.touched = false;
    this.isValid = true;
  }


  // translateSearchPlaceholder() {
  //   setTimeout(() => {
  //     const input = document.querySelector('.iti__search-input') as HTMLInputElement;

  //     if (!input) return;

  //     if (this.isRTL()) {
  //       input.placeholder = 'ابحث عن دولة أو رمز الاتصال';
  //       input.setAttribute('aria-label', input.placeholder);
  //     } else {
  //       const defaultText = 'Search country or dial code';

  //       input.placeholder = defaultText;
  //       input.setAttribute('aria-label', defaultText);
  //     }
  //   });
  // }
}

