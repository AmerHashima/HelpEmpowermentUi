// src\app\components\home\home.component.ts
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PageBannerComponent } from '../../../shared/clientSide/page-banner/page-banner.component';
import { FeatureComponent } from '../../../shared/clientSide/feature/feature.component';
import { SocialLinksComponent } from '../../../shared/clientSide/social-links/social-links.component';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { CertificationCardsComponent, CertificationItem } from '../../../shared/clientSide/certification-cards/certification-cards.component';
import { HomeArticlesComponent } from './home-articles/home-articles.component';
import { HomeFAQComponent } from './home-faq/home-faq.component';
import { GenericModelComponent } from '../../../shared/generic-model/generic-model.component';
import { EnrollFormComponent } from '../services/enroll-form/enroll-form.component';
import { HomeServicesComponent } from './home-services/home-services.component';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [PageBannerComponent,FeatureComponent,SocialLinksComponent,
    SiteButtonComponent, TranslateModule, TranslatePipe, CertificationCardsComponent,
    HomeArticlesComponent, HomeFAQComponent, HomeServicesComponent
    // GenericModelComponent,EnrollFormComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild('homeCertificationCards') certCards!: ElementRef;
  @ViewChild('homeServiceCards') serviceCards!: ElementRef;


  private shared=inject(Shared);
  isRTL=this.shared.isRtl;
  homeVideo='assets/videos/Home.mp4';
  // showEnrollForm:boolean=false;
  // enrolledCertification:CertificationItem| null=null;
  scrollToElement(elRef: ElementRef | null, headerOffset: number = 140) {
    if (!elRef) return;

    const el = elRef.nativeElement as HTMLElement;
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  onStartJourney() {
    this.scrollToElement(this.certCards);
  }

  onCorporateClick() {
    this.scrollToElement(this.serviceCards);
  }

  // onEnrollToCourse(course:any){
  //   this.showEnrollForm=true;
  //   this.enrolledCertification=course;
  //   console.log('enrolledCertification',this.enrolledCertification);
  // }

  // onEnrollSubmittion(enrollData:any){
  //   //get course name or id form   this.enrolledCertification and rest on info from enrollData
  //   console.log('send to enrroll api')
  // }
}
