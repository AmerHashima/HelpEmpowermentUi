// src\app\components\ClientSide\auth\register\register.component.ts
import { Component, inject } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PhoneInputComponent } from '../../../../shared/phone/phone.component';
import { AuthService } from '../../../../Services/auth.service';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
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
  private auth = inject(AuthService);
  private toasting = inject(ToastingMessagesService);

  private router=inject(Router);
  isRTL = this.shared.isRtl;
  lang=this.shared.lang;

  credentials = {
    firstName: '',
    lastName: '',
    firstNameAr: '',
    lastNameAr: '',
    username:'',
    email:'',
    mobile:"",
    password: '',
    confirmPassword:'',
    // terms: false
  };

  onRegister() {
    const payload = {
      nameEn: `${this.credentials.firstName} ${this.credentials.lastName}`,
      nameAr: `${this.credentials.firstNameAr} ${this.credentials.lastNameAr}`,
      email: this.credentials.email,
      mobile: this.credentials.mobile,
      username: this.credentials.username,
      password: this.credentials.password,
      confirmPassword:this.credentials.confirmPassword,
      // isActive: true,
      // createdBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    };

    this.auth.registerStudent(payload).subscribe({
      next: ()=> {
        // this.toasting.showToast('Account created suffccessfully please login','success');
        this.router.navigateByUrl(`/${this.lang()}/auth/login`);},
      error: () => this.toasting.showToast('Failed to create User', 'error')
    })
    console.log('Submitted credentials:', this.credentials);
  }
}
