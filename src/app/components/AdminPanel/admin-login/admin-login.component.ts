import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../../shared/input/input.component';
import { TranslatePipe } from '@ngx-translate/core';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { Shared } from '../../../shared/Services/shared/shared';
import { AuthService } from '../../../Services/auth.service';
import { ToastingMessagesService } from '../../../shared/Services/ToastingMessages/toasting-messages.service';

@Component({
  selector: 'app-admin-login',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    InputComponent,
    TranslatePipe,
    SiteButtonComponent,
    RouterLink
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  private shared = inject(Shared);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toasting = inject(ToastingMessagesService);
  isRTL = this.shared.isRtl;
  lang = this.shared.lang;

  credentials = {
    password: '',
    username: ''
  };

  onLoginSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.auth.loginAdmin(this.credentials).subscribe({
      next: () => {
        this.router.navigateByUrl(`/admin`);
      },
      })
  }

}
