import { certifications } from './../../../../shared/clientSide/certification-cards/certification-cards.component';
import { Component, computed, inject } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { AuthService } from '../../../../Services/auth.service';
import { PageBannerComponent } from '../../../../shared/clientSide/page-banner/page-banner.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { StarRatingComponent } from '../../../../shared/star-rating/star-rating.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { CoureseOutlineComponent } from '../courese-outline/courese-outline.component';
import { CoureseFeaturesComponent } from '../courese-features/courese-features.component';
import { CouresePlayerComponent, Lesson } from '../courese-player/courese-player.component';
import { CoureseContentComponent } from '../courese-content/courese-content.component';
import { ResourcesComponent } from '../course-resources/course-resources.component';
import { InstructorInfoComponent } from '../../../AdminPanel/certifications/instructor-info/instructor-info.component';
import { TargetAudienceComponent } from '../../../AdminPanel/certifications/target-audience/target-audience.component';

@Component({
  selector: 'app-recorded-course',
  imports: [PageBannerComponent, SiteButtonComponent, StarRatingComponent, TranslateModule,
    TranslatePipe, NgIf, CoureseOutlineComponent, CoureseFeaturesComponent, CouresePlayerComponent,
    CoureseContentComponent, ResourcesComponent, InstructorInfoComponent, TargetAudienceComponent
  ],
  templateUrl: './recorded-course.component.html',
  styleUrl: './recorded-course.component.scss'
})
export class RecordedCourseComponent {
  private shared = inject(Shared);
  private auth = inject(AuthService);
  isRTL = this.shared.isRtl;
  hasBought = this.auth.hasBought;

  enrollImage = 'assets/images/enroll.png';
  recoedImage = "assets/images/recordedCourse.jpeg";


  buyNow() {
    // Implement buy logic (e.g. open checkout, call service, etc.)
    console.log('Buy Now clicked');
  }

  addToCart() {
    // Implement add to cart logic
    console.log('Add to Cart clicked');
  }
}
