import { Component, inject } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { AuthService } from '../../../../Services/auth.service';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule, NgForm } from '@angular/forms';
import { InputComponent } from '../../../../shared/input/input.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-forget-password',
  imports: [TranslatePipe,FormsModule,InputComponent,SiteButtonComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  private shared = inject(Shared);
  private auth = inject(AuthService);
  private toasting = inject(ToastingMessagesService);
  isRTL = this.shared.isRtl;
  lang = this.shared.lang;


  credentials = {
    email: '',
    userType:'e4ff8622-ce5c-4844-81d0-d3017a1ba7c6'
  };


  countdown = 60;
  canResend = false;
  private timer: any;

  startCountdown() {
    this.canResend = false;
    this.countdown = 60;

    this.timer = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.canResend = true;
      }
    }, 1000);
  }


  async onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }


    try {
      const isSent = await this.auth
        .forgetStudentPassword(this.credentials)
        .toPromise();

      if (!isSent) {
        this.toasting.showToast('forgetPassword.error', 'error');
        return;
      }

      // 2️⃣ Send Email via EmailJS
      const emailData = {
        email: this.credentials.email,
        otp: '1234',
        reset_link: 'http://144.91.127.150:8082/en/auth/verify-otp?email=' + this.credentials.email
      };

      await emailjs.send(
        environment.mailServiceId,
        environment.resetTemolateId,
        emailData,
        {
          publicKey: environment.mailPublicKey
        }
      );


      this.toasting.showToast('forgetPassword.emailSent', 'success');

      this.startCountdown();

    }catch (apiError: any) {

        const apiMessage =
          apiError?.error?.message ||
          apiError?.error?.errors?.[0] ||
          'forgetPassword.error';

        this.toasting.showToast(apiMessage, 'error');
      }
    // } catch (err) {
    //   console.error(err);

    //   this.toasting.showToast('forgetPassword.error', 'error');
    // }
  }


}
