import { Component, inject } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { PageBannerComponent } from '../../../../shared/clientSide/page-banner/page-banner.component';
import { TranslatePipe } from '@ngx-translate/core';
import { UpcomingSessionsComponent } from '../upcoming-sessions/upcoming-sessions.component';
import { CoureseFeaturesComponent } from '../courese-features/courese-features.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';

@Component({
  selector: 'app-webinar',
  imports: [PageBannerComponent,TranslatePipe,UpcomingSessionsComponent,CoureseFeaturesComponent,
    SiteButtonComponent
  ],
  templateUrl: './webinar.component.html',
  styleUrl: './webinar.component.scss'
})
export class WebinarComponent {
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;

  courseImage = "assets/images/webinar/webinar.jpeg";

  registerNow() { }
}
