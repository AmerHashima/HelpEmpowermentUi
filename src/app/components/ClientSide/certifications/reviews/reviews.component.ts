import { Component, computed, inject, input, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
  @ViewChildren(PhoneInputComponent)
  phoneCmps!: QueryList<PhoneInputComponent>;
  private shared=inject(Shared);
  isRTL=this.shared.isRtl;
  currentCetification=this.shared.currentCertificate;
  titlePart1 = input<string>('');
  titlePart2 = input<string>('');
  description = input<string>('');
  sectionImage = input<string>('');
  courseImage = "assets/images/reviewers/review.jpeg";
  pmpReviews = [
    {
      id: 1,
      reviewerName: "Ahmed Hassan",
      reviewerImage: "assets/images/reviewers/person.png",
      reviewDate: "10/21/2026",
      reviewTopic: "reviews.topics.pmp",
      reviewRate: 5,
      reviewDescription: "reviews.items.0.description",
    },
    {
      id: 2,
      reviewerName: "Sarah Ali",
      reviewerImage: "assets/images/reviewers/person.png",
      reviewDate: "09/12/2026",
      reviewTopic: "reviews.topics.agile",
      reviewRate: 4,
      reviewDescription: "reviews.items.1.description",
    },
    {
      id: 3,
      reviewerName: "Mohamed Samir",
      reviewerImage: "assets/images/reviewers/person.png",
      reviewDate: "08/03/2026",
      reviewTopic: "reviews.topics.scrum",
      reviewRate: 5,
      reviewDescription: "reviews.items.2.description",
    },
    {
      id: 4,
      reviewerName: "Lina Youssef",
      reviewerImage: "assets/images/reviewers/person.png",
      reviewDate: "07/18/2026",
      reviewTopic: "reviews.topics.projectManagement",
      reviewRate: 4,
      reviewDescription: "reviews.items.3.description",
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
    this.phoneCmps?.forEach(c => c.resetState());
  }

  onAddNewReview(form:NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      this.phoneCmps?.forEach(c => c.validateOnSubmit());
      return;
    }
    //send call to api
    console.log('addNewReview');
  }
}
