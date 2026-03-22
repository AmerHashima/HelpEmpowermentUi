import { Component, computed, inject, ViewChild } from '@angular/core';
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
  private shared = inject(Shared);
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

  registerNow() {
    this.showConfirm=true;
    this,this.webinarForm.resetForm();
   }

  onWebinarRegister(){
    //send call to api
    console.log('webinarData');
  }
}
