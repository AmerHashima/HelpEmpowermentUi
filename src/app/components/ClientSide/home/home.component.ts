// src\app\components\home\home.component.ts
import { Component, inject } from '@angular/core';
import { PageBannerComponent } from '../../../shared/clientSide/page-banner/page-banner.component';
import { FeatureComponent } from '../../../shared/clientSide/feature/feature.component';
import { SocialLinksComponent } from '../../../shared/clientSide/social-links/social-links.component';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { CertificationCardsComponent } from '../../../shared/clientSide/certification-cards/certification-cards.component';
import { HomeArticlesComponent } from './home-articles/home-articles.component';
import { HomeFAQComponent } from './home-faq/home-faq.component';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [PageBannerComponent,FeatureComponent,SocialLinksComponent,
    SiteButtonComponent, TranslateModule, TranslatePipe, CertificationCardsComponent,
    HomeArticlesComponent, HomeFAQComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private shared=inject(Shared);
  isRTL=this.shared.isRtl;
  homeVideo='assets/videos/Home.mp4';
  onStartJourney(){}
  onCorporateClick(){}
}
