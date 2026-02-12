import { Component, inject } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PhoneInputComponent } from '../../../../shared/phone/phone.component';
@Component({
  selector: 'app-register',
  standalone:true,
  imports: [SiteButtonComponent,InputComponent,TranslateModule,
    TranslatePipe, RouterLink, FormsModule,PhoneInputComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;
  lang=this.shared.lang;

  credentials = {
    firstName: '',
    lastName: '',
    email:'',
    phone:"",
    password: '',
    confirmPassword:'',
    terms: false
  };

  onRegister() {
    console.log('Submitted credentials:', this.credentials);
  }
}
