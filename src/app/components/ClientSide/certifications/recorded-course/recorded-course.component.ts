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

@Component({
  selector: 'app-recorded-course',
  imports: [PageBannerComponent,SiteButtonComponent,StarRatingComponent,TranslateModule,
    TranslatePipe, NgIf, CoureseOutlineComponent,CoureseFeaturesComponent
  ],
  templateUrl: './recorded-course.component.html',
  styleUrl: './recorded-course.component.scss'
})
export class RecordedCourseComponent {
  private shared = inject(Shared);
  private auth = inject(AuthService);
  isRTL = this.shared.isRtl;
  certification=this.shared.currentCertificate;
  hasBought = this.auth.hasBought;

  courseOutlines=computed(()=>{
    if(this.certification() == 'pmp')
      return  [
      "Leadership Level",
      "Project Management Fundamentals & Framework",
      "Project Life Cycles & Development Approaches",
      "Project Integration Management",
      "Scope, Schedule, and Cost Management",
      "Quality, Resource, and Communications Management",
      "Risk, Procurement, and Stakeholder Management",
      "Professional Responsibility & Ethics",
      "Real-world scenario simulations, tool-based planning exercises, and agile methodology implementation",
      "Applying the main domains “People, Process & Business Environment” in the 49 processes.",
    ];
    else
      return [
        "Foundation & Awareness Level",
        "Project Management Fundamentals & Framework",
        "Project Life Cycles & Development Approaches",
        "Project Integration Management",
        "Scope, Schedule, and Cost Management",
        "Quality, Resource, and Communications Management",
        "Risk, Procurement, and Stakeholder Management",
        "Professional Responsibility & Ethics",
        "Real-world scenario simulations, tool-based planning exercises, and agile methodology"
      ];
  })
  courseFeatures = computed(() => {
    if (this.certification() == 'pmp')
      return [
        {
          title: "Instant Qualification",
          description:
            "Get your 35-hour certificate immediately upon completion to meet exam requirements.",
        },
        {
          title: "Always Updated",
          description:
            "Learn the most current exam content aligned with PMI's latest standards.",
        },
        {
          title: "Expert-Led Training",
          description:
            "Learn from certified PMPs who bridge theory with real project experience.",
        },
        {
          title: "Flexible Access",
          description:
            "Review recorded course videos anytime for 9 full months after your live sessions.",
        },
        {
          title: "Smart Study Path",
          description:
            "Follow your personalized study plan to focus efficiently on what matters most.",
        },
        {
          title: "Continuous Support",
          description:
            "Get answers from expert instructors and collaborate with peers throughout your journey.",
        },
        {
          title: "Career-Ready Skills",
          description:
            "Master practical techniques and real case studies you can apply directly at work.",
        },
        {
          title: "Professional Network Access",
          description:
            "Join an active community of project managers for knowledge sharing, job opportunities, and career support.",
        },
        {
          title: "Career Empowerment Circle",
          description:
            "Your certification journey includes lifelong access to mentorship, networking, and exclusive job openings.",
        },
      ];
    else
      return [
        {
          title: 'Instant Qualification',
          description:
            'Get your 23-hour certificate immediately upon completion to meet exam requirements.',
        },
        {
          title: 'Always Updated',
          description:
            "Learn the most current exam content aligned with PMI's latest standards.",
        },
        {
          title: 'Expert-Led Training',
          description:
            'Learn from certified Experts who bridge theory with real project experience.',
        },
        {
          title: 'Flexible Access',
          description:
            'Review recorded course videos anytime for 9 full months after your live sessions.',
        },
        {
          title: 'Smart Study Path',
          description:
            'Follow your personalized study plan to focus efficiently on what matters most.',
        },
        {
          title: 'Continuous Support',
          description:
            'Get answers from expert instructors and collaborate with peers throughout your journey.',
        },
        {
          title: 'Career-Ready Skills',
          description:
            'Master practical techniques and real case studies you can apply directly at work.',
        },
        {
          title: 'Professional Network Access',
          description:
            'Join an active community of project managers for knowledge sharing, job opportunities, and career support.',
        },
        {
          title: 'Career Empowerment Circle',
          description:
            'Your certification journey includes lifelong access to mentorship, networking, and exclusive job openings.',
        },
      ];
  });

  enrollImage = 'assets/images/enroll.png';
  recoedImage ="assets/images/recordedCourse.jpeg";


  buyNow() {
    // Implement buy logic (e.g. open checkout, call service, etc.)
    console.log('Buy Now clicked');
  }

  addToCart() {
    // Implement add to cart logic
    console.log('Add to Cart clicked');
  }
}
