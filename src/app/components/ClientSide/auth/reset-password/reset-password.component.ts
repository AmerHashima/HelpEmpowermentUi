import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../../Services/auth.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { InputComponent } from '../../../../shared/input/input.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [TranslatePipe, NgIf, FormsModule, InputComponent, SiteButtonComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private toasting = inject(ToastingMessagesService);

  email = '';
  tempToken = ''; // optional if backend uses it

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  model = {
    password: '',
    confirmPassword: ''
  };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.tempToken = params['tempToken']
    });
  }

  onReset(form: NgForm) {

    if (form.invalid || !this.passwordsMatch() ){
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    };

    // if (this.model.password !== this.model.confirmPassword) {
    //   this.errorMessage = 'resetPassword.passwordMismatch';
    //   return;
    // }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      email: this.email,
      newPassword: this.model.password,
      confirmPassword: this.model.confirmPassword,
      token: this.tempToken
    };

    this.auth.resetStudentPassword(payload).subscribe({
      next: () => {
        this.successMessage = 'resetPassword.success';

        setTimeout(() => {
          this.router.navigate([`/${'en'}/auth/login`]);
        }, 2000);
      },
      error: (err) => {

        const apiMessage =
          err?.error?.message ||
          err?.error?.errors?.[0] ||
          'resetPassword.error';

        this.toasting.showToast(apiMessage, 'error');
      },
      // error: () => {
      //   this.errorMessage = 'resetPassword.error';
      // },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  passwordsMatch(): boolean {
    return this.model.password === this.model.confirmPassword;
  }

}
