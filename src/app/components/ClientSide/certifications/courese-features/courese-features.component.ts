import { Component, computed, inject, input, output } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { AuthService } from '../../../../Services/auth.service';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { Shared } from '../../../../shared/Services/shared/shared';
import { StudentService } from '../../../../Services/student-service.service';

@Component({
  selector: 'app-courese-features',
  imports: [TranslateModule, TranslatePipe, AccordionComponent, SiteButtonComponent],
  templateUrl: './courese-features.component.html',
  styleUrl: './courese-features.component.scss'
})
export class CoureseFeaturesComponent {
  private shared = inject(Shared);
  certification = this.shared.currentCertificate;
  type = input<string>('features');
  isEnrolled = input<boolean>(false);
  title = input<string>('Course Features');
  buy = output<void>();

//   courseFeatures = computed(() => {
//     if (this.certification() == 'pmp' && this.type() == 'features')
//       return [
//         {
//           title: "Instant Qualification",
//           description:
//             "Get your 35-hour certificate immediately upon completion to meet exam requirements.",
//         },
//         {
//           title: "Always Updated",
//           description:
//             "Learn the most current exam content aligned with PMI's latest standards.",
//         },
//         {
//           title: "Expert-Led Training",
//           description:
//             "Learn from certified PMPs who bridge theory with real project experience.",
//         },
//         {
//           title: "Flexible Access",
//           description:
//             "Review recorded course videos anytime for 9 full months after your live sessions.",
//         },
//         {
//           title: "Smart Study Path",
//           description:
//             "Follow your personalized study plan to focus efficiently on what matters most.",
//         },
//         {
//           title: "Continuous Support",
//           description:
//             "Get answers from expert instructors and collaborate with peers throughout your journey.",
//         },
//         {
//           title: "Career-Ready Skills",
//           description:
//             "Master practical techniques and real case studies you can apply directly at work.",
//         },
//         {
//           title: "Professional Network Access",
//           description:
//             "Join an active community of project managers for knowledge sharing, job opportunities, and career support.",
//         },
//         {
//           title: "Career Empowerment Circle",
//           description:
//             "Your certification journey includes lifelong access to mentorship, networking, and exclusive job openings.",
//         },
//       ];
//     else if (this.certification() == 'pmp' && this.type() == 'webinar')
//       return [
//         {
//           title: 'Hour 1: The Essential Knowledge of PMP',
//           description:
//             `Decode the Exam: Learn the structure of the PMP exam, including the crucial People, Process, and Business Environment domains and the Waterfall/Agile/Hybrid focus.
// Build Your Action Plan: Get a clear, five-step roadmap, from navigating the PMI application to building an effective study strategy, that you can start immediately.
// Master the PMI Mindset: Discover the critical thinking approach unique to PMI that is the key to selecting the right answers on the exam.`
//         },
//         {
//           title: 'Hour 2: Interactive Q&A',
//           description:
//             `Get Expert Answers: Have your specific questions about the application, study materials, and exam topics answered live by a PMP-certified professional.\nSolve Real Challenges: Discuss common study roadblocks and real-world project scenarios to understand how PMP principles are applied.\n Plan Your Path Forward: Receive personalized guidance on your next steps and learn about resources to transform your preparation from overwhelming to organized and confident.\n`
//         },
//         {
//           title: 'What You Will Leave With:',
//           description:
//             `A clear, stress-free understanding of the entire PMP journey.\nA practical, 5-step action plan you can start immediately.\nAnswers to your most pressing questions from an expert.\n`
//         },
//         {
//           title: 'What You Will Leave With:',
//           description:
//             `A clear, stress-free understanding of the entire PMP journey.\nA practical, 5-step action plan you can start immediately.\n Answers to your most pressing questions from an expert.\n`
//         },
//       ];
//     else if (this.certification() == 'pmp' && this.type() == 'audience')
//       return [
//         {
//           title: "Who Should Attend:",
//           description:
//             `Project Coordinators, Team Leads, and aspiring Project Managers\n.Professionals with experience who are unsure how to qualify for the PMP.\nAnyone who has started studying but feels overwhelmed by the exam content.\nIndividuals seeking a proven, structured methodology for exam success.\n`
//         },
//       ];
//     else if (this.certification() == 'pmp' && this.type() == 'takeAway')
//       return [
//         {
//           title: " What You Will Leave With:",
//           description:
//             `A clear, stress-free understanding of the entire PMP journey.\nA practical, 5-step action plan you can start immediately.\nAnswers to your most pressing questions from an expert.\n`
//         },
//       ];
//     else if (this.certification() == 'capm' && this.type() == 'features')
//       return [
//         {
//           title: 'Instant Qualification',
//           description:
//             'Get your 23-hour certificate immediately upon completion to meet exam requirements.',
//         },
//         {
//           title: 'Always Updated',
//           description:
//             "Learn the most current exam content aligned with PMI's latest standards.",
//         },
//         {
//           title: 'Expert-Led Training',
//           description:
//             'Learn from certified Experts who bridge theory with real project experience.',
//         },
//         {
//           title: 'Flexible Access',
//           description:
//             'Review recorded course videos anytime for 9 full months after your live sessions.',
//         },
//         {
//           title: 'Smart Study Path',
//           description:
//             'Follow your personalized study plan to focus efficiently on what matters most.',
//         },
//         {
//           title: 'Continuous Support',
//           description:
//             'Get answers from expert instructors and collaborate with peers throughout your journey.',
//         },
//         {
//           title: 'Career-Ready Skills',
//           description:
//             'Master practical techniques and real case studies you can apply directly at work.',
//         },
//         {
//           title: 'Professional Network Access',
//           description:
//             'Join an active community of project managers for knowledge sharing, job opportunities, and career support.',
//         },
//         {
//           title: 'Career Empowerment Circle',
//           description:
//             'Your certification journey includes lifelong access to mentorship, networking, and exclusive job openings.',
//         },
//       ];

//     else return [];
//   });
  buyNow() {
    this.buy.emit();
  }



  courseFeatures = computed(() => {
    if (this.certification() === 'pmp' && this.type() === 'features')
      return [
        {
          title: 'courseFeatures.pmp.features.instantQualification.title',
          description: 'courseFeatures.pmp.features.instantQualification.description',
        },
        {
          title: 'courseFeatures.pmp.features.alwaysUpdated.title',
          description: 'courseFeatures.pmp.features.alwaysUpdated.description',
        },
        {
          title: 'courseFeatures.pmp.features.expertLedTraining.title',
          description: 'courseFeatures.pmp.features.expertLedTraining.description',
        },
        {
          title: 'courseFeatures.pmp.features.flexibleAccess.title',
          description: 'courseFeatures.pmp.features.flexibleAccess.description',
        },
        {
          title: 'courseFeatures.pmp.features.smartStudyPath.title',
          description: 'courseFeatures.pmp.features.smartStudyPath.description',
        },
        {
          title: 'courseFeatures.pmp.features.continuousSupport.title',
          description: 'courseFeatures.pmp.features.continuousSupport.description',
        },
        {
          title: 'courseFeatures.pmp.features.careerReadySkills.title',
          description: 'courseFeatures.pmp.features.careerReadySkills.description',
        },
        {
          title: 'courseFeatures.pmp.features.professionalNetworkAccess.title',
          description: 'courseFeatures.pmp.features.professionalNetworkAccess.description',
        },
        {
          title: 'courseFeatures.pmp.features.careerEmpowermentCircle.title',
          description: 'courseFeatures.pmp.features.careerEmpowermentCircle.description',
        },
      ];

    else if (this.certification() === 'pmp' && this.type() === 'webinar')
      return [
        {
          title: 'courseFeatures.pmp.webinar.hour1.title',
          description: 'courseFeatures.pmp.webinar.hour1.description',
        },
        {
          title: 'courseFeatures.pmp.webinar.hour2.title',
          description: 'courseFeatures.pmp.webinar.hour2.description',
        },
        {
          title: 'courseFeatures.pmp.webinar.takeAway.title',
          description: 'courseFeatures.pmp.webinar.takeAway.description',
        }
      ];

    else if (this.certification() === 'capm' && this.type() === 'webinar')
      return [
        {
          title: 'courseFeatures.capm.webinar.hour1.title',
          description: 'courseFeatures.capm.webinar.hour1.description',
        },
        {
          title: 'courseFeatures.capm.webinar.hour2.title',
          description: 'courseFeatures.capm.webinar.hour2.description',
        },
        {
          title: 'courseFeatures.capm.webinar.takeAway.title',
          description: 'courseFeatures.capm.webinar.takeAway.description',
        }
      ];

    else if (this.certification() === 'pmp' && this.type() === 'audience')
      return [
        {
          title: 'courseFeatures.pmp.audience.title',
          description: 'courseFeatures.pmp.audience.description',
        },
      ];
    else if (this.certification() === 'capm' && this.type() === 'audience')
      return [
        {
          title: 'courseFeatures.capm.audience.title',
          description: 'courseFeatures.capm.audience.description',
        },
      ];


    else if (this.certification() === 'pmp' && this.type() === 'takeAway')
      return [
        {
          title: 'courseFeatures.pmp.takeAway.title',
          description: 'courseFeatures.pmp.takeAway.description',
        },
      ];

    else if (this.certification() === 'capm' && this.type() === 'takeAway')
      return [
        {
          title: 'courseFeatures.capm.takeAway.title',
          description: 'courseFeatures.capm.takeAway.description',
        },
      ];


    else if (this.certification() === 'capm' && this.type() === 'features')
      return [
        {
          title: 'courseFeatures.capm.features.instantQualification.title',
          description: 'courseFeatures.capm.features.instantQualification.description',
        },
        {
          title: 'courseFeatures.capm.features.alwaysUpdated.title',
          description: 'courseFeatures.capm.features.alwaysUpdated.description',
        },
        {
          title: 'courseFeatures.capm.features.expertLedTraining.title',
          description: 'courseFeatures.capm.features.expertLedTraining.description',
        },
        {
          title: 'courseFeatures.capm.features.flexibleAccess.title',
          description: 'courseFeatures.capm.features.flexibleAccess.description',
        },
        {
          title: 'courseFeatures.capm.features.smartStudyPath.title',
          description: 'courseFeatures.capm.features.smartStudyPath.description',
        },
        {
          title: 'courseFeatures.capm.features.continuousSupport.title',
          description: 'courseFeatures.capm.features.continuousSupport.description',
        },
        {
          title: 'courseFeatures.capm.features.careerReadySkills.title',
          description: 'courseFeatures.capm.features.careerReadySkills.description',
        },
        {
          title: 'courseFeatures.capm.features.professionalNetworkAccess.title',
          description: 'courseFeatures.capm.features.professionalNetworkAccess.description',
        },
        {
          title: 'courseFeatures.capm.features.careerEmpowermentCircle.title',
          description: 'courseFeatures.capm.features.careerEmpowermentCircle.description',
        },
      ];

    return [];
  });
}
