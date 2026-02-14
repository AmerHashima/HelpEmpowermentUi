import { Component, computed, inject, input, ViewChild } from '@angular/core';
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
interface ReviewItem {
  reviewerName: string;
  reviewDate: string;
  reviewTopic: string;
  reviewRate: number;
  reviewDescription: string;
}
@Component({
  selector: 'app-reviews',
  imports: [PageBannerComponent,SiteButtonComponent,TranslatePipe,ReviewComponent,
    GenericModelComponent,TextareaComponent,InputComponent,PhoneInputComponent,FormsModule
  ],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent {
  @ViewChild('newReviewForm') reviewForm!: NgForm;
  private shared=inject(Shared);
  isRTL=this.shared.isRtl;
  currentCetification=this.shared.currentCertificate;
  titlePart1 = input<string>('');
  titlePart2 = input<string>('');
  description = input<string>('');
  sectionImage = input<string>('');
  courseImage = "assets/images/webinar/webinar.jpeg";
  pmpReviews = [
    {
      id: 1,
      reviewerName: "Ahmed Hassan",
      reviewerImage: "assets/images/reviewers/person.png",
      reviewDate: "10/21/2026",
      reviewTopic: "PMP",
      reviewRate: 5,
      reviewDescription:
        "The PMP course was extremely well structured and easy to follow. The explanations were clear, practical, and helped me pass the exam on my first attempt.",
    },
    {
      id: 2,
      reviewerName: "Sarah Ali",
      reviewerImage: "assets/images/reviewers/person.png",
      reviewDate: "09/12/2026",
      reviewTopic: "Agile Management",
      reviewRate: 4,
      reviewDescription:
        "Great learning experience overall. The real-world examples made complex concepts easier to understand. I highly recommend this course for professionals.",
    },
    {
      id: 3,
      reviewerName: "Mohamed Samir",
      reviewerImage: "assets/images/reviewers/person.png",
      reviewDate: "08/03/2026",
      reviewTopic: "Scrum Master",
      reviewRate: 5,
      reviewDescription:
        "Excellent content and instructor support. The mock exams and practice questions were very close to the real exam and boosted my confidence.",
    },
    {
      id: 4,
      reviewerName: "Lina Youssef",
      reviewerImage: "assets/images/reviewers/person.png",
      reviewDate: "07/18/2026",
      reviewTopic: "Project Management",
      reviewRate: 4,
      reviewDescription:
        "Well-organized course with a strong focus on practical application. The materials were up-to-date and easy to understand.",
    },
  ];
  showConfirm = false;

  review={
    fullname:'',
    email:'',
    phone:'',
    message:''
  }
  reviews=computed(()=>{
   if(this.currentCetification() == 'pmp')
    return this.pmpReviews
  else return [];
  })


  showAddReview() {
    this.showConfirm = true;
    this.reviewForm.resetForm();
  }

  onAddNewReview() {
    //send call to api
    console.log('addNewReview');
  }
}
