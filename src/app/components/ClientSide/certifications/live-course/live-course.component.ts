// src\app\components\ClientSide\certifications\live-course\live-course.component.ts
import { Component, computed, inject } from '@angular/core';
import { PageBannerComponent } from '../../../../shared/clientSide/page-banner/page-banner.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { CoureseAudienceComponent } from '../courese-audience/courese-audience.component';
import { CoureseContentComponent } from '../courese-content/courese-content.component';
import { CoureseFeaturesComponent } from '../courese-features/courese-features.component';
import { CoureseOutlineComponent } from '../courese-outline/courese-outline.component';
import { InstructorInfoComponent } from '../../../AdminPanel/certifications/instructor-info/instructor-info.component';
import { TargetAudienceComponent } from '../../../AdminPanel/certifications/target-audience/target-audience.component';
import { Shared } from '../../../../shared/Services/shared/shared';
import { AuthService } from '../../../../Services/auth.service';
import { StarRatingComponent } from '../../../../shared/star-rating/star-rating.component';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { UpcomingSessionsComponent } from '../upcoming-sessions/upcoming-sessions.component';
import { CartService } from '../../../../Services/  cart.service';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { StudentService } from '../../../../Services/student-service.service';

@Component({
  selector: 'app-live-course',
  imports: [PageBannerComponent, SiteButtonComponent,
    CoureseContentComponent, CoureseFeaturesComponent, CoureseOutlineComponent, InstructorInfoComponent,
    TargetAudienceComponent, StarRatingComponent, TranslatePipe, NgIf, UpcomingSessionsComponent, GenericModelComponent
  ],
  templateUrl: './live-course.component.html',
  styleUrl: './live-course.component.scss'
})
export class LiveCourseComponent {
  private shared = inject(Shared);
  private auth = inject(AuthService);
  private cartService = inject(CartService);
  private toasting = inject(ToastingMessagesService);
  isRTL = this.shared.isRtl;
  private studentService = inject(StudentService);
  isEnrolled = this.studentService.isLiveCourseEnrolled;
  showConfirm: boolean = false;
  enrollImage = 'assets/images/enroll.png';
  courseImage = "assets/images/liveCourse/liveCourse.jpeg";
  hasLiveCourseAccess = computed(
    () => this.isEnrolled() && this.studentService.showExamSimulator === true
  );
  liveCourseContent = computed(() => {
    const cert = this.shared.currentCertificate();
    const key = cert === 'capm' ? 'capm' : 'pmp';

    return {
      master: `liveCourse.${key}.master`,
      title: `liveCourse.${key}.title`,
      description: `liveCourse.${key}.description`,
      price: `liveCourse.${key}.price`
    };
  });

  buyNow() {
    console.log('Buy Now clicked');
  }


  addToCart(): void {
    if (!this.auth.studentToken()) {
      this.showConfirm = true;
      return;
    }

    const courseId = this.shared.currentCertificationObject().oid;

    if (this.cartService.courseExists(courseId)) {

      if (this.cartService.isInCart(courseId, 'liveCourseReserv')) {
        this.toasting.showToast('cart.exist', 'warning');
        return;
      }

      this.updateExistingCourse(courseId);
      return;
    }

    this.addNewCourse(courseId);
  }

  private updateExistingCourse(courseId: string): void {

    const course = this.cartService.getCourse(courseId);
    if (!course) return;

    const payload = {
      oid: course.oid,
      quantity: course.quantity,
      couponCode: course.couponCode,
      examSimulationReserv: course.examSimulationReserv,
      recordedCourseReserv: course.recordedCourseReserv,
      liveCourseReserv: true,
    };

    this.cartService.updateCartItem(payload.oid, payload).subscribe({
      next: (cartItem) => this.cartService.updateBasket(cartItem)
    });
  }
  private addNewCourse(courseId: string): void {

    const cartPayload = {
      studentId: this.auth.loggedStudent()?.userId!,
      courseId,
      examSimulationReserv: false,
      recordedCourseReserv: false,
      liveCourseReserv: true,
      couponCode: "",
    };

    this.cartService.addCartItem(cartPayload).subscribe({
      next: (cartItem) => this.cartService.updateBasket(cartItem)
    });
  }
}
