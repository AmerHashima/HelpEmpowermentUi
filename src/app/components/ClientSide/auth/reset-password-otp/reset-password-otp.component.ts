import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { AuthService } from '../../../../Services/auth.service';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';

@Component({
  selector: 'app-reset-password-otp',
  imports: [TranslatePipe, NgIf, FormsModule, InputComponent, SiteButtonComponent],
  templateUrl: './reset-password-otp.component.html',
  styleUrl: './reset-password-otp.component.scss'
})
export class ResetPasswordOTPComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private toasting = inject(ToastingMessagesService);
  otp = '';
  email = '';
  errorMessage = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  onVerify(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    };

    const payload = {
      email: this.email,
      otpCode: this.otp,
      userType: 'e4ff8622-ce5c-4844-81d0-d3017a1ba7c6'
    };

    this.auth.verifyOtp(payload).subscribe({
      next: (data) => {
        this.router.navigate(['/en/auth/reset-password'], {
          queryParams: {
            email: this.email,
            tempToken: data.resetToken
          }
        });
      },
      error: (err) => {

        const apiMessage =
          err?.error?.message ||
          err?.error?.errors?.[0] ||
          'otp.invalid';

        this.toasting.showToast(apiMessage, 'error');
      }
      // error: () => {
      //   this.errorMessage = 'otp.invalid';
      // }
    });
  }
}
