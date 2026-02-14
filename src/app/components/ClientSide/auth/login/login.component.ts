// src\app\components\ClientSide\auth\login\login.component.ts
import { Component, inject, ViewChild, signal } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormItemComponent } from '../../../../shared/form-item/form-item.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { FormsModule, NgControl } from '@angular/forms';
import { CheckboxComponent } from '../../../../shared/checkbox/checkbox.component';

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
  isRTL = this.shared.isRtl;
  lang=this.shared.lang;

  credentials = {
    email: '',
    password: '',
    rememberMe: false
  };

  onLoginSubmit() {
    //console.log('Submitted credentials:', this.credentials);
  }
}
