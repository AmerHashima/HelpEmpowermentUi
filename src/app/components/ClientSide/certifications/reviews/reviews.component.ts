import { NgClass, NgIf } from '@angular/common';
import { Component, computed, effect, inject, input, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { PageBannerComponent } from '../../../../shared/clientSide/page-banner/page-banner.component';
import { Shared } from '../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { ReviewComponent } from './review/review.component';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { TextareaComponent } from '../../../../shared/text-area/text-area.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { PhoneInputComponent } from '../../../../shared/phone/phone.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { ContactUsService } from '../../../../Services/contact-us.service';
import { AuthService } from '../../../../Services/auth.service';
import { forkJoin } from 'rxjs';
import { TranslateService } from '../../../../Services/translate.service';
import { CertificationReviewContactLookUp } from '../../../../data/lookUPS';
import { APIContact } from '../../../../models/contact-us';
interface ReviewItem {
  reviewerName: string;
  reviewDate: string;
  reviewTopic: string;
  reviewRate: number;
  reviewDescription: string;
  reviewerImage:string
}
@Component({
  selector: 'app-reviews',
  imports: [PageBannerComponent,SiteButtonComponent,TranslatePipe,ReviewComponent,NgClass,
    GenericModelComponent,TextareaComponent,InputComponent,PhoneInputComponent,FormsModule,NgIf
  ],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent {
  @ViewChild('newReviewForm') reviewForm!: NgForm;
  @ViewChildren(PhoneInputComponent)
  phoneCmps!: QueryList<PhoneInputComponent>;
  private shared=inject(Shared);
  private toasting=inject(ToastingMessagesService);
  private contactService=inject(ContactUsService);
  private translationService=inject(TranslateService);
  private auth=inject(AuthService);
  student=this.auth.loggedStudent;
  showConfirm=false;
  mustLogged:boolean=false;
  isRTL=this.shared.isRtl;
  currentCetification=this.shared.currentCertificate;

  titlePart1 = input<string>('');
  titlePart2 = input<string>('');
  description = input<string>('');
  sectionImage = input<string>('');
  reviews = signal<ReviewItem[]>([]);
  courseImage = "assets/images/reviewers/review.jpeg";
  page = signal(1);
  pageSize = signal(6);
  review={
    fullname:'',
    email:'',
    phone:'',
    message:'',
    reviewRate:0
  }
  totalCount = signal(0);
  totalPages = computed(() =>
    Math.ceil(this.totalCount() / this.pageSize())
  );
  refreshTrigger = signal(0);
  private reviewChannel = new BroadcastChannel('reviews');
  constructor() {
    effect(() => {
      this.shared.currentCertificationObject()?.oid;
      this.page.set(1);
    });

    effect((onCleanup) => {
      const courseOid = this.shared.currentCertificationObject()?.oid;
      const page = this.page();
      const size = this.pageSize();
      this.refreshTrigger();
      if (!courseOid) return;

      const sub = this.contactService
        .getReviewMessages(courseOid, page, size)
        .subscribe(res => {
          this.reviews.set(this.mapReviews(res.data));
          this.totalCount.set(res.totalCount);
        });

      onCleanup(() => sub.unsubscribe());
    });

    this.reviewChannel.onmessage = (event) => {

      if (event.data.type === 'REVIEW_DELETED') {

        this.refreshTrigger.update(v => v + 1);

      }

    };
  }

  private mapReviews(apiReviews: any[]): ReviewItem[] {
    return apiReviews.map(r => ({
      reviewerImage: "assets/images/reviewers/person.png",
      reviewerName: this.isRTL() ? r.fullNameAr :r.fullName,
      reviewDate: new Date(r.createdAt).toLocaleDateString(),
      reviewTopic: `${this.shared.currentCertificate().toUpperCase()} Review`,
      reviewRate: Number(r.subjectAr) || 0,
      reviewDescription: this.extractReviewMessage(r.message)
    }));
  }

  showAddReview() {
    if (this.student() && this.student()?.userId) {
      this.showConfirm = true;
      this.review = {
        fullname: this.student()?.nameEn || '',
        email: this.student()?.email || '',
        phone: this.student()?.mobile || '',
        message: '',
        reviewRate: 0
      };
      this.reviewForm.resetForm({
        fullname: this.student()?.nameEn || '',
        email: this.student()?.email || '',
        phone: this.student()?.mobile || '',
        message: '',
        reviewRate:0
      });
      this.phoneCmps?.forEach(c => c.resetState());
    }else{
      this.mustLogged=true;
    }
  }

  onAddNewReview(form: NgForm) {
    if (form.invalid || this.review.reviewRate === 0) {
          Object.values(form.controls).forEach(control => {
            control.markAsTouched();
          });
          this.phoneCmps?.forEach(c => c.validateOnSubmit());
          return;
        }

        forkJoin({
          fullNameAr: this.translationService.translateEnToAr(this.review.fullname),
          messageAr: this.translationService.translateEnToAr(this.review.message)
        }).subscribe(translations => {

          const payload = {
            fullName: this.review.fullname,
            fullNameAr: translations.fullNameAr,
            email: this.review.email,
            phone: '',
            mobile: this.review.phone,
            subject: this.shared.currentCertificationObject()?.oid || '',
            subjectAr: this.review.reviewRate.toString(),
            message: this.getReviewMessage(),
            messageAr: translations.messageAr,
            contactTypeLookupId: CertificationReviewContactLookUp,
            studentId: this.student()?.userId!
          };

          this.contactService.createContactMessage(payload).subscribe({
            next: () => {
              this.showConfirm=false;
              if(this.page() === 1)
              this.refreshTrigger.update(v => v + 1);
              else
              this.page.set(1)

            },
            error: (err) => {

              const apiMessage =
                err?.error?.message ||
                err?.error?.errors?.[0] ||
                'contact.error.sendMessage';

              this.toasting.showToast(apiMessage, 'error');
            },
          });

        });

    }

  setRate(value: number) {
    this.review.reviewRate = value;
  }
  getReviewMessage(){
    return `Certification: ${this.shared.currentCertificate()}\nReview: ${this.review.message}\nRating: ${this.review.reviewRate}`;
  }

  private extractReviewMessage(message: string): string {
    if (!message) return '';

    const match = message.match(/Review:\s*(.*)/i);
    return match ? match[1] : message;
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
    }
  }

  nextPage() {
    if (this.page() < Math.ceil(this.totalCount() / this.pageSize())) {
      this.page.update(p => p + 1);
    }
  }

  ngOnDestroy() {
    this.reviewChannel.close();
  }
}
