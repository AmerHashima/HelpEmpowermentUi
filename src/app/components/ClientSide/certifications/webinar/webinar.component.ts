import { Component, computed, effect, inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { PageBannerComponent } from '../../../../shared/clientSide/page-banner/page-banner.component';
import { TranslatePipe } from '@ngx-translate/core';
import { UpcomingSessionsComponent } from '../upcoming-sessions/upcoming-sessions.component';
import { CoureseFeaturesComponent } from '../courese-features/courese-features.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { FormsModule, NgForm } from '@angular/forms';
import { InputComponent } from '../../../../shared/input/input.component';
import { PhoneInputComponent } from '../../../../shared/phone/phone.component';
import { AuthService } from '../../../../Services/auth.service';
import { forkJoin } from 'rxjs';
import { TranslateService } from '../../../../Services/translate.service';
import { webinarContactLookup } from '../../../../data/lookUPS';
import { ContactUsService } from '../../../../Services/contact-us.service';

@Component({
  selector: 'app-webinar',
  imports: [PageBannerComponent,TranslatePipe,UpcomingSessionsComponent,CoureseFeaturesComponent,
    SiteButtonComponent,GenericModelComponent,FormsModule,InputComponent,PhoneInputComponent
  ],
  templateUrl: './webinar.component.html',
  styleUrl: './webinar.component.scss'
})
export class WebinarComponent {
  @ViewChild('webinarRegisterForm') webinarForm!: NgForm;
  @ViewChildren(PhoneInputComponent)
  phoneCmps!: QueryList<PhoneInputComponent>;
  private shared = inject(Shared);
  private auth=inject(AuthService);
  private translationService=inject(TranslateService);
  private contactService=inject(ContactUsService);
  student=this.auth.loggedStudent;
  isRTL = this.shared.isRtl;
  showConfirm = false;
  courseImage = "assets/images/webinar/webinar.jpeg";

  webinarContent = computed(() => {
    const cert = this.shared.currentCertificate();
    const key = cert === 'capm' ? 'capm' : 'pmp';

    return {
      master: `webinar.${key}.master`,
      title: `webinar.${key}.title`,
      description: `webinar.${key}.description`
    };
  });

  webinar = {
    fullname: '',
    email: '',
    phone: '',
    position: '',
  };


 
  private patchUserData() {
    const user = this.student();

    if (user) {
      this.webinar.fullname = user.nameEn;
      this.webinar.email = user.email || '';
      this.webinar.phone = user.mobile || '';
    }
  }

  registerNow() {
    this.showConfirm=true;
    this.webinarForm.resetForm();
    setTimeout(() => {
      this.patchUserData();
    });
   }

  // onWebinarRegister(){
  //   //send call to api
  //   console.log('webinarData');
  // }


  onWebinarRegister(form: NgForm) {
      // if (this.student() && this.student()?.userId) {
        if (form.invalid) {
          Object.values(form.controls).forEach(control => {
            control.markAsTouched();
          });
          this.phoneCmps?.forEach(c => c.validateOnSubmit());
          return;
        }

        forkJoin({
          fullNameAr: this.translationService.translateEnToAr(this.webinar.fullname),
        }).subscribe(translations => {

          const payload = {
            fullName: this.webinar.fullname,
            fullNameAr: translations.fullNameAr,
            email: this.webinar.email,
            phone: '',
            mobile: this.webinar.phone,
            subject: '',
            subjectAr: '',
            message: this.shared.currentCertificate(),
            messageAr: this.shared.currentCertificate(),
            contactTypeLookupId: webinarContactLookup,
            studentId: this.student()?.userId!
          };

          this.contactService.createContactMessage(payload).subscribe({
            next: () => {
              form.resetForm({
                fullname: this.student()?.nameEn || '',
                email: this.student()?.email || '',
                phone: this.student()?.mobile || '',
                message: ''
              });
              this.phoneCmps?.forEach(c => c.resetState());
              this.showConfirm=false;
            },
          });

        });
      // }
    }
}
