import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActiveStatus, createdUpdatedOID } from '../../../../data/lookUPS';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { SpkNgSelectComponent } from '../../../../shared/spk-ng-select/spk-ng-select.component';
import { LookupService } from '../../../../Services/lookup.service';
import { AsyncPipe } from '@angular/common';
import { ModeratorService } from '../../../../Services/moderator-services.service';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';

@Component({
  selector: 'app-moderator-form',
  standalone: true,

  imports: [SiteButtonComponent, InputComponent,AsyncPipe,
    TranslatePipe, FormsModule, SpkNgSelectComponent, GenericModelComponent
  ],
   templateUrl: './moderator-form.component.html',
  styleUrl: './moderator-form.component.scss'
})
export class ModeratorFormComponent {
  oid = input<string>('');
  cancalEvent = output<void>();
  status = ActiveStatus;
  private shared = inject(Shared);
  private toasting = inject(ToastingMessagesService);
  private moderatorService = inject(ModeratorService);
  private lookupService=inject(LookupService);
  userRoles$ = this.lookupService.getUserRoles();
  userStatuses$ = this.lookupService.getUserStatuses();

  isRTL = this.shared.isRtl;
  lang = this.shared.lang;
  submitting = signal(false);
  changingPassword = signal(false);
  passwordPopupOpen = signal(false);

  credentials = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleLookupId:'',
    statusLookupId:'',
    isActive:false
  };

  passwordCredentials = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor() {
    effect(() => {
      const oid = this.oid();
      this.resetCredentials();
      if (!oid) return;

      this.moderatorService.getModerator(oid).subscribe({
        next: (user) => {
          this.credentials = {
            username: user.username ?? '',
            email: user.email ?? '',
            password: '',
            confirmPassword: '',
            roleLookupId: user.roleLookupId ?? '',
            statusLookupId: user.statusLookupId ?? '',
            isActive: user.isActive
          };
        }
      });
    });
  }

  onRegister(form: NgForm) {

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.oid() && this.credentials.password !== this.credentials.confirmPassword) {
      this.toasting.showToast('Password and confirm password must match.', 'error');
      return;
    }

    const commonPayload = {
      email: this.credentials.email,
      username: this.credentials.username,
      roleLookupId: this.credentials.roleLookupId,
      statusLookupId: this.credentials.statusLookupId,
      isActive: this.credentials.isActive
    };

    const request$ = this.oid()
      ? this.moderatorService.updateModerator(this.oid(), { ...commonPayload, updatedBy: createdUpdatedOID })
      : this.moderatorService.createModerator({
          ...commonPayload,
          password: this.credentials.password,
          createdBy: createdUpdatedOID
        });

    this.submitting.set(true);
    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.moderatorService.reloadModerators(this.moderatorService.pageNumber());
        this.cancel(form);
      },
      error: (err) => {
        this.submitting.set(false);
        if (err instanceof Error) this.toasting.showToast(err.message, 'error');
      }
    });
  }

  onChangePassword(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    if (this.passwordCredentials.newPassword !== this.passwordCredentials.confirmPassword) {
      this.toasting.showToast('Password and confirm password must match.', 'error');
      return;
    }

    this.changingPassword.set(true);
    this.moderatorService.changePassword({
      oid: this.oid(),
      userId: this.oid(),
      currentPassword: this.passwordCredentials.currentPassword,
      newPassword: this.passwordCredentials.newPassword,
      confirmPassword: this.passwordCredentials.confirmPassword,
      updatedBy: createdUpdatedOID
    }).subscribe({
      next: () => {
        this.changingPassword.set(false);
        this.closePasswordPopup(form);
      },
      error: (err) => {
        this.changingPassword.set(false);
        if (err instanceof Error) this.toasting.showToast(err.message, 'error');
      }
    });
  }

  openPasswordPopup() {
    this.passwordCredentials = { currentPassword: '', newPassword: '', confirmPassword: '' };
    this.passwordPopupOpen.set(true);
  }

  closePasswordPopup(form?: NgForm) {
    this.passwordPopupOpen.set(false);
    this.passwordCredentials = { currentPassword: '', newPassword: '', confirmPassword: '' };
    form?.resetForm(this.passwordCredentials);
  }

  passwordsDoNotMatch(): boolean {
    return !!this.passwordCredentials.confirmPassword &&
      this.passwordCredentials.newPassword !== this.passwordCredentials.confirmPassword;
  }

  cancel(form:NgForm) {
    form.form.markAsUntouched();
    form.reset();
    this.cancalEvent.emit();
  }

  createPasswordsDoNotMatch(): boolean {
    return !this.oid() && !!this.credentials.confirmPassword &&
      this.credentials.password !== this.credentials.confirmPassword;
  }

  private resetCredentials() {
    this.credentials = {
      username: '', email: '', password: '', confirmPassword: '',
      roleLookupId: '', statusLookupId: '', isActive: false
    };
    this.passwordCredentials = { currentPassword: '', newPassword: '', confirmPassword: '' };
  }
}
