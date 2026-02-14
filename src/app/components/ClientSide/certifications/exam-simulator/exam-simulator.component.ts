import { Component, effect, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconCardComponent } from '../../../../shared/icon-card/icon-card.component';
import { Shared } from '../../../../shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { FeatureComponent } from '../../../../shared/clientSide/feature/feature.component';
import { StarRatingComponent } from '../../../../shared/star-rating/star-rating.component';
import { PageBannerComponent } from '../../../../shared/clientSide/page-banner/page-banner.component';
import { NgIf } from '@angular/common';
import { SimulatorExamsComponent } from '../simulator-exams/simulator-exams.component';
import { AuthService } from '../../../../Services/auth.service';
import { ChooseExamComponent } from '../choose-exam/choose-exam.component';

@Component({
  selector: 'app-exam-simulator',
  imports: [IconCardComponent,SiteButtonComponent,TranslateModule,TranslatePipe,FeatureComponent,
    StarRatingComponent, PageBannerComponent, NgIf, SimulatorExamsComponent, ChooseExamComponent

  ],
  templateUrl: './exam-simulator.component.html',
  styleUrl: './exam-simulator.component.scss'
})
export class ExamSimulatorComponent {
  private shared = inject(Shared);
  private auth = inject(AuthService);
  isRTL = this.shared.isRtl;
  hasBought=this.auth.hasBought;
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

  constructor(private router: Router,private route:ActivatedRoute) {
    effect(()=>{
      const _=this.shared.currentExamId();
      // this.chooseExam=true;
    })
  }

  navigateToFreeExam() {
    this.router.navigate(['../chooseExam'], {
      relativeTo: this.route
    });
    // this.chooseExam=true;
    this.shared.currentExamId.set('free');
  }

  buyNow() {
    // Implement buy logic (e.g. open checkout, call service, etc.)
    console.log('Buy Now clicked');
  }

  addToCart() {
    // Implement add to cart logic
    console.log('Add to Cart clicked');
  }
}
