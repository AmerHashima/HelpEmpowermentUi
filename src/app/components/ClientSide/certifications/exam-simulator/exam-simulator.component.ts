// src\app\components\ClientSide\certifications\exam-simulator\exam-simulator.component.ts
import { Component, effect, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconCardComponent } from '../../../../shared/icon-card/icon-card.component';
import { Shared } from '../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { FeatureComponent } from '../../../../shared/clientSide/feature/feature.component';
import { StarRatingComponent } from '../../../../shared/star-rating/star-rating.component';
import { PageBannerComponent } from '../../../../shared/clientSide/page-banner/page-banner.component';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { SimulatorExamsComponent } from '../simulator-exams/simulator-exams.component';
import { AuthService } from '../../../../Services/auth.service';
import { CartService } from '../../../../Services/  cart.service';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';

@Component({
  selector: 'app-exam-simulator',
  imports: [IconCardComponent, SiteButtonComponent, TranslateModule, TranslatePipe, FeatureComponent,
    StarRatingComponent, PageBannerComponent, NgIf, SimulatorExamsComponent,
    GenericModelComponent
  ],
  templateUrl: './exam-simulator.component.html',
  styleUrl: './exam-simulator.component.scss',
})
export class ExamSimulatorComponent {
  private platformId = inject(PLATFORM_ID);
  private cartService = inject(CartService);
  private shared = inject(Shared);
  private auth = inject(AuthService);
  private toasting = inject(ToastingMessagesService);
  isRTL = this.shared.isRtl;
  hasBought = this.auth.hasBought;
  studentToken = this.auth.studentToken;
  // certification=this.shared.currentCertificationObject
  //  chooseExam:boolean=false;
  examSimulatorBenfits = [
    {
      title: "Always Current",
      icon: "bi bi-arrow-clockwise",
      description: "Matches the latest PMP exam format and content.",
      gap: "gap-1",
    },
    {
      title: "Massive Practice Bank",
      icon: "bi bi-database",
      description: "1,620 realistic questions across 9 full exams.",
      gap: "gap-1",
    },
    {
      title: "Two Smart Modes",
      icon: "bi bi-toggles",
      description: "Practice without time pressure or simulate the real exam.",
      gap: "gap-1",
    },
    {
      title: "Learn, Don't Memorize",
      icon: "bi bi-lightbulb",
      description:
        "Detailed explanations for every answer to build understanding.",
      gap: "gap-1",
    },
    {
      title: "Lesson Learned Feature",
      icon: "bi bi-journal-check",
      description:
        "Practice your incorrect questions until they become strengths.",
      gap: "gap-1",
    },
    {
      title: "Performance Dashboard",
      icon: "bi bi-bar-chart-line",
      description: "See exactly what to improve with clear visual reports.",
      gap: "gap-1",
    },
    {
      title: "Unlimited Attempts",
      icon: "bi bi-infinity",
      description: "Practice as much as you need until you feel fully ready.",
      gap: "gap-1",
    },
    {
      title: "9-Month Access",
      icon: "bi bi-calendar-check",
      description: "Full 9 months of unlimited access to all simulator features.",
      gap: "gap-1",
    },
    {
      title: "Always Here to Help",
      icon: "bi bi-headset",
      description:
        "Reach out anytime, we're here to ensure your journey to PMP success is smooth and supported.",
      gap: "gap-1",
    },
  ];;

  simulatorVideo = 'assets/videos/SimulatorVideo.mp4';
  enrollImage = 'assets/images/enroll.png';
  showConfirm: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute) {
    console.log('certifications', this.shared.certifications());
    effect(() => {
      const _ = this.shared.currentExamId();
      // this.chooseExam=true;
    })

  }

  navigateToFreeExam() {
    // this.chooseExam=true;
    this.shared.currentExamId.set('free');
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentExamId', 'free');
    }
    this.router.navigate(['../chooseExam'], {
      relativeTo: this.route
    });
  }

  buyNow() {
    // Implement buy logic (e.g. open checkout, call service, etc.)
    console.log('Buy Now clicked');
  }

  // addToCart() {
  //   if(this.auth.studentToken()){
  //     const courseId = this.shared.currentCertificationObject().oid;
  //     if(this.cartService.courseExists(courseId)){
  //       if (this.cartService.isInCart(courseId, 'examSimulationReserv')) {
  //         this.toasting.showToast('Item is already added before', 'warning');
  //       }else{
  //         const course = this.cartService.getCourse(courseId);
  //         console.log('course', course);
  //         if(course){
  //           const payload = {
  //             oid: course.oid,
  //             quantity: course.quantity,
  //             couponCode: course.couponCode,
  //            examSimulationReserv: true,
  //             recordedCourseReserv: course.recordedCourseReserv,
  //             liveCourseReserv: course.liveCourseReserv,
  //           }
  //           this.cartService.updateCartItem(payload.oid, payload).subscribe({
  //             next: (cartItem) => {
  //               console.log('cartItem', cartItem);
  //               this.cartService.updateBasket(cartItem);
  //               console.log('cartItems', this.cartService.cartItems());
  //             }
  //           })
  //         }

  //       }
  //     }else{
  //       const cartPayload = {
  //         studentId: this.auth.loggedStudent()?.userId!,
  //         courseId: courseId,
  //         examSimulationReserv: true,
  //         recordedCourseReserv: false,
  //         liveCourseReserv: false,
  //         couponCode: "",
  //       }
  //       console.log('cartPayload', cartPayload);
  //       this.cartService.addCartItem(cartPayload).subscribe({
  //         next: (cartItem) => {
  //           console.log('cartItem', cartItem);
  //           this.cartService.updateBasket(cartItem);
  //           console.log('cartItems',this.cartService.cartItems());
  //         }
  //       })
  //     }
  //   }else{
  //     this.showConfirm=true;
  //   }
  // }
  addToCart(): void {
    if (!this.auth.studentToken()) {
      this.showConfirm = true;
      return;
    }

    const courseId = this.shared.currentCertificationObject().oid;

    if (this.cartService.courseExists(courseId)) {

      if (this.cartService.isInCart(courseId, 'examSimulationReserv')) {
        this.toasting.showToast('Item is already added before', 'warning');
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
      examSimulationReserv: true,
      recordedCourseReserv: course.recordedCourseReserv,
      liveCourseReserv: course.liveCourseReserv,
    };

    this.cartService.updateCartItem(payload.oid, payload).subscribe({
      next: (cartItem) => this.cartService.updateBasket(cartItem)
    });
  }
  private addNewCourse(courseId: string): void {

    const cartPayload = {
      studentId: this.auth.loggedStudent()?.userId!,
      courseId,
      examSimulationReserv: true,
      recordedCourseReserv: false,
      liveCourseReserv: false,
      couponCode: "",
    };

    this.cartService.addCartItem(cartPayload).subscribe({
      next: (cartItem) => this.cartService.updateBasket(cartItem)
    });
  }
}

