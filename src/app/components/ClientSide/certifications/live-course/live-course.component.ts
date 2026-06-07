// src\app\components\ClientSide\certifications\live-course\live-course.component.ts
import { Component, computed, inject, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
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
import { NgClass, NgIf } from '@angular/common';
import { UpcomingSessionsComponent } from '../upcoming-sessions/upcoming-sessions.component';
import { CartService } from '../../../../Services/  cart.service';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { StudentService } from '../../../../Services/student-service.service';
import { FormsModule, NgForm } from '@angular/forms';
import { PhoneInputComponent } from '../../../../shared/phone/phone.component';
import { LiveCourseContactLookUp } from '../../../../data/lookUPS';
import { ContactUsService } from '../../../../Services/contact-us.service';
import { InputComponent } from '../../../../shared/input/input.component';
import { CourseVideo } from '../../../../models/course-video';
import { catchError, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CourseVideosService } from '../../../../Services/course-videos.service';
import { CertificationService } from '../../../../Services/certification.service';

@Component({
  selector: 'app-live-course',
  imports: [PageBannerComponent, SiteButtonComponent,FormsModule,InputComponent,PhoneInputComponent,
    CoureseContentComponent, CoureseFeaturesComponent, CoureseOutlineComponent, InstructorInfoComponent,
    TargetAudienceComponent, StarRatingComponent, TranslatePipe, NgIf, UpcomingSessionsComponent, GenericModelComponent,
    NgClass
  ],
  templateUrl: './live-course.component.html',
  styleUrl: './live-course.component.scss'
})
export class LiveCourseComponent {
  @ViewChild('liveCourseRegisterForm') liveCourseForm!: NgForm;
  @ViewChildren(PhoneInputComponent)
  phoneCmps!: QueryList<PhoneInputComponent>;
  private shared = inject(Shared);
  private auth = inject(AuthService);
  private cartService = inject(CartService);
  private toasting = inject(ToastingMessagesService);
  private contactService=inject(ContactUsService);
    private courseVideosService = inject(CourseVideosService);

  isRTL = this.shared.isRtl;
  student= this.auth.loggedStudent;
  RegisterSession:any=null;
  private studentService = inject(StudentService);
  isEnrolled = this.studentService.isLiveCourseEnrolled;
  showConfirm: boolean = false;
  showRegisterConfirm: boolean = false;
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
  private certificationService=inject(CertificationService);
  price = this.certificationService.liveCoursePrice;
  count = signal<number>(0);
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


  ngOnInit() {
    this.studentService
      .getEnrollmentCount(this.shared.currentCertificate(), 'live')
      .subscribe(count => {
        this.count.set(count);
      });
  
  }
  buyNow() {
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


  liveCourse = {
    fullname: '',
    email: '',
    phone: '',
    position: '',
  };



  private patchUserData() {
    const user = this.student();

    if (user) {
      this.liveCourse.fullname = user.nameEn;
      this.liveCourse.email = user.email || '';
      this.liveCourse.phone = user.mobile || '';
    }
  }

  registerNow() {
    this.showRegisterConfirm = true;
    this.liveCourseForm.resetForm();
    setTimeout(() => {
      this.patchUserData();
    });
  }




  onLiveCourseRegister(form: NgForm) {
    if (this.student() && this.student()?.userId) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      this.phoneCmps?.forEach(c => c.validateOnSubmit());
      return;
    }


      const payload = {
        fullName: this.liveCourse.fullname,
        fullNameAr: this.liveCourse.fullname,
        email: this.liveCourse.email,
        phone: '',
        mobile: this.liveCourse.phone,
        subject: '',
        subjectAr: '',
        message: this.geEnrollMessage(),
        messageAr: this.shared.currentCertificate(),
        contactTypeLookupId: LiveCourseContactLookUp,
        studentId: this.student()?.userId!
      };

      this.contactService.createContactMessage(payload).subscribe({
        next: () => {
          form.resetForm({
            fullname: this.student()?.nameEn || '',
            email: this.student()?.email || '',
            phone: this.student()?.mobile || '',
            message: ''
          });
          this.phoneCmps?.forEach(c => c.resetState());
          this.showRegisterConfirm = false;
          this.RegisterSession=null
        },
        error: (err) => {
          this.showRegisterConfirm = false;
          this.RegisterSession = null
          const apiMessage =
            err?.error?.message ||
            err?.error?.errors?.[0] ||
            'Something went wrong while sending your request';

          this.toasting.showToast(apiMessage, 'error');
        }
      });

    }
    else {
      this.showConfirm=true
    }
  }
  register(session:any){

    this.showRegisterConfirm=true;
    this.RegisterSession=session;
    this.patchUserData();

  }

  geEnrollMessage() {
    const session=this.RegisterSession;
    return `I want to register in ${session.title} Live Course on ${session.date} at ${session.time},
My Job Position is: ${this.liveCourse.position}`;
  }
}
