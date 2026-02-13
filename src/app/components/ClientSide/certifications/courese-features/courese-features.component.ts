import { Component, computed, inject, input } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { AuthService } from '../../../../Services/auth.service';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { Shared } from '../../../../shared/Services/shared/shared';

@Component({
  selector: 'app-courese-features',
  imports: [TranslateModule,TranslatePipe,AccordionComponent,SiteButtonComponent],
  templateUrl: './courese-features.component.html',
  styleUrl: './courese-features.component.scss'
})
export class CoureseFeaturesComponent {
  private shared=inject(Shared);
  private auth=inject(AuthService);
  hasBought=this.auth.hasBought;
  isRTL=this.shared.isRtl;
  certification = this.shared.currentCertificate;


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
  buyNow(){
    console.log('buy now');
  }
}
