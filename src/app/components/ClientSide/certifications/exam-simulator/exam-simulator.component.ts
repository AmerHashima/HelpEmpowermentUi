// src\app\components\ClientSide\certifications\exam-simulator\exam-simulator.component.ts
import { Component, computed, effect, inject, Input, PLATFORM_ID, signal } from '@angular/core';
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
import { StudentService } from '../../../../Services/student-service.service';

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
  private studentService = inject(StudentService);
  isEnrolled =computed(()=>{
    console.log('is entolled', this.studentService.isExamSimulatorEnrolled())
    return this.studentService.isExamSimulatorEnrolled();
  })
  private toasting = inject(ToastingMessagesService);
  isRTL = this.shared.isRtl;
  // studentToken = this.auth.studentToken;
  isLoggedIn = computed(() => !!this.auth.studentToken());
  hydrated = signal(false);
  certification=this.shared.currentCertificationObject
  //  chooseExam:boolean=false;

  private capmBenefits = [
    {
      title: "capmBenefits.0.title",
      icon: "bi bi-arrow-clockwise",
      description: "capmBenefits.0.description",
      gap: "gap-1",
    },
    {
      title: "capmBenefits.1.title",
      icon: "bi bi-database",
      description: "capmBenefits.1.description",
      gap: "gap-1",
    },
    {
      title: "capmBenefits.2.title",
      icon: "bi bi-toggles",
      description: "capmBenefits.2.description",
      gap: "gap-1",
    },
    {
      title: "capmBenefits.3.title",
      icon: "bi bi-lightbulb",
      description: "capmBenefits.3.description",
      gap: "gap-1",
    },
    {
      title: "capmBenefits.4.title",
      icon: "bi bi-journal-check",
      description: "capmBenefits.4.description",
      gap: "gap-1",
    },
    {
      title: "capmBenefits.5.title",
      icon: "bi bi-bar-chart-line",
      description: "capmBenefits.5.description",
      gap: "gap-1",
    },
    {
      title: "capmBenefits.6.title",
      icon: "bi bi-infinity",
      description: "capmBenefits.6.description",
      gap: "gap-1",
    },
    {
      title: "capmBenefits.7.title",
      icon: "bi bi-calendar-check",
      description: "capmBenefits.7.description",
      gap: "gap-1",
    },
    {
      title: "capmBenefits.8.title",
      icon: "bi bi-headset",
      description: "capmBenefits.8.description",
      gap: "gap-1",
    }
  ];
  private pmpBenefits = [
    {
      title: "examSimulatorBenefits.0.title",
      icon: "bi bi-arrow-clockwise",
      description: "examSimulatorBenefits.0.description",
      gap: "gap-1",
    },
    {
      title: "examSimulatorBenefits.1.title",
      icon: "bi bi-database",
      description: "examSimulatorBenefits.1.description",
      gap: "gap-1",
    },
    {
      title: "examSimulatorBenefits.2.title",
      icon: "bi bi-toggles",
      description: "examSimulatorBenefits.2.description",
      gap: "gap-1",
    },
    {
      title: "examSimulatorBenefits.3.title",
      icon: "bi bi-lightbulb",
      description: "examSimulatorBenefits.3.description",
      gap: "gap-1",
    },
    {
      title: "examSimulatorBenefits.4.title",
      icon: "bi bi-journal-check",
      description: "examSimulatorBenefits.4.description",
      gap: "gap-1",
    },
    {
      title: "examSimulatorBenefits.5.title",
      icon: "bi bi-bar-chart-line",
      description: "examSimulatorBenefits.5.description",
      gap: "gap-1",
    },
    {
      title: "examSimulatorBenefits.6.title",
      icon: "bi bi-infinity",
      description: "examSimulatorBenefits.6.description",
      gap: "gap-1",
    },
    {
      title: "examSimulatorBenefits.7.title",
      icon: "bi bi-calendar-check",
      description: "examSimulatorBenefits.7.description",
      gap: "gap-1",
    },
    {
      title: "examSimulatorBenefits.8.title",
      icon: "bi bi-headset",
      description: "examSimulatorBenefits.8.description",
      gap: "gap-1",
    }
  ];


  examKey = computed(() => {
    const cert = this.shared.currentCertificate();
    return cert === 'capm' ? 'capm' : 'pmp';
  });

  examSimulatorBenefitsComputed = computed(() => {
    const cert = this.shared.currentCertificate();

    if (cert === 'capm') {
      return this.capmBenefits;
    }

    return this.pmpBenefits;
  });

  simulatorVideo = 'assets/videos/SimulatorVideo.mp4';
  enrollImage = 'assets/images/enroll.png';
  showConfirm: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute) {
    effect(() => {
      const _ = this.shared.currentExamId();
      // this.chooseExam=true;
    })

  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.hydrated.set(true);
    }
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
    // if (!this.auth.studentToken()) {
    if (!this.isLoggedIn()) {

      this.showConfirm = true;
      return;
    }

    const courseId = this.shared.currentCertificationObject().oid;

    if (this.cartService.courseExists(courseId)) {

      if (this.cartService.isInCart(courseId, 'examSimulationReserv')) {
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

