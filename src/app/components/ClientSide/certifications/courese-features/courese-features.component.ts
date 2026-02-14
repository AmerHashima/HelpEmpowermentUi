import { Component, computed, inject, input } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { AuthService } from '../../../../Services/auth.service';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { Shared } from '../../../../shared/Services/shared/shared';

@Component({
  selector: 'app-courese-features',
  imports: [TranslateModule, TranslatePipe, AccordionComponent, SiteButtonComponent],
  templateUrl: './courese-features.component.html',
  styleUrl: './courese-features.component.scss'
})
export class CoureseFeaturesComponent {
  private shared = inject(Shared);
  private auth = inject(AuthService);
  hasBought = this.auth.hasBought;
  isRTL = this.shared.isRtl;
  certification = this.shared.currentCertificate;
  type = input<string>('features');
  title = input<string>('Course Features');

  courseFeatures = computed(() => {
    if (this.certification() == 'pmp' && this.type() == 'features')
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
    else if (this.certification() == 'pmp' && this.type() == 'webinar')
      return [
        {
          title: 'Hour 1: The Essential Knowledge of PMP',
          description:
            `Decode the Exam: Learn the structure of the PMP exam, including the crucial People, Process, and Business Environment domains and the Waterfall/Agile/Hybrid focus.
Build Your Action Plan: Get a clear, five-step roadmap, from navigating the PMI application to building an effective study strategy, that you can start immediately.
Master the PMI Mindset: Discover the critical thinking approach unique to PMI that is the key to selecting the right answers on the exam.`
        },
        {
          title: 'Hour 2: Interactive Q&A',
          description:
            `Get Expert Answers: Have your specific questions about the application, study materials, and exam topics answered live by a PMP-certified professional.\nSolve Real Challenges: Discuss common study roadblocks and real-world project scenarios to understand how PMP principles are applied.\n Plan Your Path Forward: Receive personalized guidance on your next steps and learn about resources to transform your preparation from overwhelming to organized and confident.\n`
        },
        {
          title: 'What You Will Leave With:',
          description:
            `A clear, stress-free understanding of the entire PMP journey.\nA practical, 5-step action plan you can start immediately.\nAnswers to your most pressing questions from an expert.\n`
        },
        {
          title: 'What You Will Leave With:',
          description:
            `A clear, stress-free understanding of the entire PMP journey.\nA practical, 5-step action plan you can start immediately.\n Answers to your most pressing questions from an expert.\n`
        },
      ];
    else if (this.certification() == 'pmp' && this.type() == 'audience')
      return [
        {
          title: "Who Should Attend:",
          description:
            `Project Coordinators, Team Leads, and aspiring Project Managers\n.Professionals with experience who are unsure how to qualify for the PMP.\nAnyone who has started studying but feels overwhelmed by the exam content.\nIndividuals seeking a proven, structured methodology for exam success.\n`
        },
      ];
    else if (this.certification() == 'pmp' && this.type() == 'takeAway')
      return [
        {
          title: " What You Will Leave With:",
          description:
          `A clear, stress-free understanding of the entire PMP journey.\nA practical, 5-step action plan you can start immediately.\nAnswers to your most pressing questions from an expert.\n`
        },
      ];
    else if (this.certification() == 'camp' && this.type() == 'features')
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

    else return [];
  });
  buyNow() {
    console.log('buy now');
  }
}
