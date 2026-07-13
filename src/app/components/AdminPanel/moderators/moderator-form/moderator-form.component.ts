import { Component, inject, input, output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormsModule, NgForm } from '@angular/forms';
import { ActiveStatus } from '../../../../data/lookUPS';
import { PhoneInputComponent } from '../../../../shared/phone/phone.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Shared } from '../../../../shared/Services/shared/shared';
import { AuthService } from '../../../../Services/auth.service';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { SpkNgSelectComponent } from '../../../../shared/spk-ng-select/spk-ng-select.component';
import { LookupService } from '../../../../Services/lookup.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-moderator-form',
  standalone: true,

  imports: [SiteButtonComponent, InputComponent,AsyncPipe,
    TranslatePipe, FormsModule, PhoneInputComponent,SpkNgSelectComponent
  ],
   templateUrl: './moderator-form.component.html',
  styleUrl: './moderator-form.component.scss'
})
export class ModeratorFormComponent {
  oid = input<string>('');
  cancalEvent = output<void>();
  fb = inject(FormBuilder);
  status = ActiveStatus;

  @ViewChildren(PhoneInputComponent)
  phoneCmps!: QueryList<PhoneInputComponent>;
  private shared = inject(Shared);
  private auth = inject(AuthService);
  private toasting = inject(ToastingMessagesService);
  private lookupService=inject(LookupService);
  userRoles$ = this.lookupService.getUserRoles();

  private router = inject(Router);
  isRTL = this.shared.isRtl;
  lang = this.shared.lang;

  credentials = {
    nameEn:'',
    nameAr: '',
    username: '',
    email: '',
    mobile: "",
    password: '',
    confirmPassword: '',
    roleLookupId:'',
    isActive:false
  };

  onRegister(form: NgForm) {

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.phoneCmps?.forEach(c => c.validateOnSubmit());
      return;
    }

    const payload = {
      nameEn: this.credentials.nameEn,
      nameAr: this.credentials.nameAr,
      email: this.credentials.email,
      mobile: this.credentials.mobile,
      username: this.credentials.username,
      password: this.credentials.password,
      confirmPassword: this.credentials.confirmPassword,
      // isActive: this.credentials.isActive,
      roleLookupId: this.credentials.roleLookupId
    };

    this.auth.registerUser(payload).subscribe({
      next: () => {
        // this.toasting.showToast('Account created suffccessfully please login','success');
        this.cancel(form);
      },
      error: (err) => {

        const apiMessage =
          err?.error?.message ||
          err?.error?.errors?.[0] ||
          'auth.register.error';
        this.toasting.showToast(apiMessage, 'error');
      }
    })
  }

  cancel(form:NgForm) {
    form.form.markAsUntouched();
    form.reset();
    this.phoneCmps?.forEach(c => c.resetState());
    this.cancalEvent.emit();
  }
}
