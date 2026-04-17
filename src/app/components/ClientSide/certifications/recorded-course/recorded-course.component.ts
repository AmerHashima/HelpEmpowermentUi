import { certifications } from './../../../../shared/clientSide/certification-cards/certification-cards.component';
import { Component, computed, inject } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { AuthService } from '../../../../Services/auth.service';
import { PageBannerComponent } from '../../../../shared/clientSide/page-banner/page-banner.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { StarRatingComponent } from '../../../../shared/star-rating/star-rating.component';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { CoureseOutlineComponent } from '../courese-outline/courese-outline.component';
import { CoureseFeaturesComponent } from '../courese-features/courese-features.component';
import { CouresePlayerComponent, Lesson } from '../courese-player/courese-player.component';
import { CoureseContentComponent } from '../courese-content/courese-content.component';
import { ResourcesComponent } from '../course-resources/course-resources.component';
import { InstructorInfoComponent } from '../../../AdminPanel/certifications/instructor-info/instructor-info.component';
import { TargetAudienceComponent } from '../../../AdminPanel/certifications/target-audience/target-audience.component';
import { CartService } from '../../../../Services/  cart.service';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { StudentService } from '../../../../Services/student-service.service';
import { CourseVideosService } from '../../../../Services/course-videos.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';
import { CourseVideo } from '../../../../models/course-video';
import { FinishCertificationComponent } from '../../finish-certification/finish-certification.component';

@Component({
  selector: 'app-recorded-course',
  imports: [PageBannerComponent, SiteButtonComponent, StarRatingComponent, TranslateModule, NgIf,FinishCertificationComponent,
    TranslatePipe, NgIf, CoureseOutlineComponent, CoureseFeaturesComponent, CouresePlayerComponent,
    CoureseContentComponent, ResourcesComponent, InstructorInfoComponent, TargetAudienceComponent, GenericModelComponent
  ],
  templateUrl: './recorded-course.component.html',
  styleUrl: './recorded-course.component.scss'
})
export class RecordedCourseComponent {
  private shared = inject(Shared);
  private auth = inject(AuthService);
  private cartService = inject(CartService);
  private toasting = inject(ToastingMessagesService);
  isRTL = this.shared.isRtl;
  showConfirm: boolean = false;
  private studentService = inject(StudentService);
  isEnrolled = this.studentService.isRecordedCoursesEnrolled;
  hasRecordedCourseAccess = computed(
    () => this.isEnrolled() && this.studentService.showExamSimulator === true
  );
  enrollImage = 'assets/images/enroll.png';
  recoedImage = "assets/images/recordedCourse.jpeg";

  recordedCourseContent = computed(() => {
    const cert = this.shared.currentCertificate();
    const key = cert === 'capm' ? 'capm' : 'pmp';

    return {
      master: `recordedCourse.${key}.master`,
      title: `recordedCourse.${key}.title`,
      description: `recordedCourse.${key}.description`,
      price: `recordedCourse.${key}.price`
    };
  });

  private courseVideosService = inject(CourseVideosService);
  certification = this.shared.currentCertificationObject;

  videosState = toSignal(
    toObservable(this.certification).pipe(
      distinctUntilChanged((a, b) => a?.oid === b?.oid),
      switchMap(cert => {
        if (!cert?.oid) {
          return of({
            data: [] as CourseVideo[],
            loading: false,
            error: 'No certification selected'
          });
        }

        return this.courseVideosService.getAllVideos(cert.oid).pipe(
          map(data => ({
            data,
            loading: false,
            error: null as string | null
          })),
          startWith({
            data: [] as CourseVideo[],
            loading: true,
            error: null
          }),
          catchError(() =>
            of({
              data: [],
              loading: false,
              error: 'Failed to load videos'
            })
          )
        );
      })
    ),
    {
      initialValue: {
        data: [] as CourseVideo[],
        loading: true,
        error: null as string | null
      }
    }
  );

  videos = computed(() => this.videosState().data);

  buyNow() {
    // Implement buy logic (e.g. open checkout, call service, etc.)
    console.log('Buy Now clicked');
  }

  addToCart(): void {
    if (!this.auth.studentToken()) {
      this.showConfirm = true;
      return;
    }

    const courseId = this.shared.currentCertificationObject().oid;

    if (this.cartService.courseExists(courseId)) {

      if (this.cartService.isInCart(courseId, 'recordedCourseReserv')) {
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
      recordedCourseReserv: true,
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
      examSimulationReserv: false,
      recordedCourseReserv: true,
      liveCourseReserv: false,
      couponCode: "",
    };

    this.cartService.addCartItem(cartPayload).subscribe({
      next: (cartItem) => this.cartService.updateBasket(cartItem)
    });
  }
}
