// src\app\components\about\about.component.ts
import { Component, inject } from '@angular/core';
import { PageBannerComponent } from '../../../shared/clientSide/page-banner/page-banner.component';
import { Shared } from '../../../shared/Services/shared/shared';
import { FeatureComponent } from '../../../shared/clientSide/feature/feature.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  imports: [PageBannerComponent, FeatureComponent, TranslatePipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;
  aboutVideo = 'assets/videos/about1.mp4'
}
