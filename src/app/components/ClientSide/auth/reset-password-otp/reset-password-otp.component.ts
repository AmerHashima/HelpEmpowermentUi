import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { AuthService } from '../../../../Services/auth.service';

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
      otp: this.otp,
    };

    this.auth.verifyOtp(payload).subscribe({
      next: () => {
        this.router.navigate(['/en/auth/reset-password'], {
          queryParams: {
            email: this.email,
            tempToken:'tempToken'
          }
        });
      },
      error: () => {
        this.errorMessage = 'otp.invalid';
      }
    });
  }
}
