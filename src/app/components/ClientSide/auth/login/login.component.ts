// src\app\components\ClientSide\auth\login\login.component.ts
import { Component, inject, ViewChild, signal } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormItemComponent } from '../../../../shared/form-item/form-item.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { FormsModule, NgControl } from '@angular/forms';
import { CheckboxComponent } from '../../../../shared/checkbox/checkbox.component';
import { AuthService } from '../../../../Services/auth.service';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    InputComponent,
    TranslateModule,
    TranslatePipe,
    SiteButtonComponent,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private shared = inject(Shared);
  private auth=inject(AuthService);
  private router = inject(Router);
  private toasting=inject(ToastingMessagesService);
  isRTL = this.shared.isRtl;
  lang=this.shared.lang;

  credentials = {
    // email: '',
    password: '',
    username:''
    // rememberMe: false
  };

  onLoginSubmit() {
    this.auth.loginStudent(this.credentials).subscribe({
      next: () => {
        // this.toasting.showToast('User has logged suffccessfully', 'success');
        this.router.navigateByUrl(`/${this.lang()}/home`);
      },
      error: () => this.toasting.showToast('Failed to login', 'error')
    })
  }
}
