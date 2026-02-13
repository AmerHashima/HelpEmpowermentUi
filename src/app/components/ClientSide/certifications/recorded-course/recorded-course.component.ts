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
import { CouresePlayerComponent, Lesson } from '../courese-player/courese-player.component';
import { CoureseContentComponent } from '../courese-content/courese-content.component';
import { ResourcesComponent } from '../course-resources/course-resources.component';
import { InstructorInfoComponent } from '../../../AdminPanel/certifications/instructor-info/instructor-info.component';
import { TargetAudienceComponent } from '../../../AdminPanel/certifications/target-audience/target-audience.component';

@Component({
  selector: 'app-recorded-course',
  imports: [PageBannerComponent, SiteButtonComponent, StarRatingComponent, TranslateModule,
    TranslatePipe, NgIf, CoureseOutlineComponent, CoureseFeaturesComponent, CouresePlayerComponent,
    CoureseContentComponent, ResourcesComponent, InstructorInfoComponent, TargetAudienceComponent
  ],
  templateUrl: './recorded-course.component.html',
  styleUrl: './recorded-course.component.scss'
})
export class RecordedCourseComponent {
  private shared = inject(Shared);
  private auth = inject(AuthService);
  isRTL = this.shared.isRtl;
  certification = this.shared.currentCertificate;
  hasBought = this.auth.hasBought;
  instructor = {
    introParagragh: "Expert in translating the organizational strategy into tangible results with 20 years of hands-on experience, I build the frameworks for lasting success. My expertise covers the full spectrum of strategic delivery:",
    skills: [
      {
        icon: "bi bi-person-badge",
        header: "Strategic Project & Program Leadership",
        text: "Directly leading complex initiatives to deliver high-value outcomes on scope, time, and budget."
      },
      {
        icon: "bi bi-briefcase",
        header: "Portfolio Optimization",
        text: "Aligning project investments with core business strategy to maximize return and manage risk."
      },
      {
        icon: "bi bi-building",
        header: "PMO Design & Implementation",
        text: "Establishing and leading Project Management Offices as strategic centers of excellence."
      },
      {
        icon: "bi bi-bar-chart",
        header: "Project Management Maturity",
        text: "Assessing and elevating organizational capabilities to improve efficiency and reduce risk."
      }
    ],
    certifcations: [
      "B.Sc. of Electrical Engineering (Computer & Automatic Control)",
      "Authorized Training Partner (PMI - ATP) Instructor",
      "PMI - Program Management Professional (PgMP)",
      "PMI - Project Management Professional (PMP)",
      "PMI – Project Management Office – Certified Practitioner (PMO-CP)",
      "PMI - Agile Certified Practitioner (PMI-ACP)",
      "PMI - Professional in Business Analysis (PMI-PBA)",
      "AXELOS – P3O certificate in Portfolio, Program and Project Offices",
      "AXELOS – ITIL Foundation Certificate in IT Services Management",
      "CompTIA Project+ PK0-003",
      "Managing Projects with Microsoft Project 2013",
      "Cisco Certified Network Associate (CCNA)",
      "Cisco Certified Network Professional (CCNP)",
      "PMI - Train The Trainer",
      "Microsoft Certified Technology Specialist (MCTS)"
    ]
  }
  courseOutlines = computed(() => {
    if (this.certification() == 'pmp')
      return [
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
  courseLessons = computed<Lesson[]>(() => {
    if (this.certification() == 'pmp')
      return [
        {
          id: 1,
          title: "Session (1) – PMI & PMP Introduction",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          unlocked: false,
          watched: false,
        },
        {
          id: 2,
          title: "Session (2) – Framework Part 1",
          duration: "3:00",
          videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
          unlocked: true,
          watched: false,
        },
        {
          id: 3,
          title: "Session (3) – Framework Part 2",
          duration: "3:00",
          videoUrl: "https://www.youtube.com/embed/l482T0yNkeo",
          unlocked: true,
          watched: false,
        },
        {
          id: 4,
          title: "Session (4) – Agile",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/3tmd-ClpJxA",
          unlocked: true,
          watched: false,
        },
        {
          id: 5,
          title: "Session (5) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/2Vv-BfVoq4g",
          unlocked: true,
          watched: false,
        },
        {
          id: 6,
          title: "Session (6) – 49 Processes",
          duration: "4:00",
          videoUrl: "https://www.youtube.com/embed/fLexgOxsZu0",
          unlocked: true,
          watched: false,
        },
        {
          id: 7,
          title: "Session (7) – Integration",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/60ItHLz5WEA",
          unlocked: true,
          watched: false,
        },
        {
          id: 8,
          title: "Session (8) – Scope",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
          unlocked: true,
          watched: false,
        },
        {
          id: 9,
          title: "Session (9) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/CevxZvSJLk8",
          unlocked: true,
          watched: false,
        },
        {
          id: 10,
          title: "Session (10) – Schedule",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/YQHsXMglC9A",
          unlocked: true,
          watched: false,
        },
        {
          id: 11,
          title: "Session (11) – Cost",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/OPf0YbXqDm0",
          unlocked: true,
          watched: false,
        },
        {
          id: 12,
          title: "Session (12) – Quality",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/JGwWNGJdvx8",
          unlocked: true,
          watched: false,
        },
        {
          id: 13,
          title: "Session (13) – Resource",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/ktvTqknDobU",
          unlocked: true,
          watched: false,
        },
        {
          id: 14,
          title: "Session (14) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/450p7goxZqg",
          unlocked: true,
          watched: false,
        },
        {
          id: 15,
          title: "Session (15) – Communication",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/09R8_2nJtjg",
          unlocked: true,
          watched: false,
        },
        {
          id: 16,
          title: "Session (16) – Risk",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/RgKAFK5djSk",
          unlocked: true,
          watched: false,
        },
        {
          id: 17,
          title: "Session (17) – Procurement",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/pRpeEdMmmQ0",
          unlocked: true,
          watched: false,
        },
        {
          id: 18,
          title: "Session (18) – Stakeholders",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/7wtfhZwyrcc",
          unlocked: true,
          watched: false,
        },
        {
          id: 19,
          title: "Session (19) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/e-ORhEE9VVg",
          unlocked: true,
          watched: false,
        },
        {
          id: 20,
          title: "Session (20) – Revision",
          duration: "3:00",
          videoUrl: "https://www.youtube.com/embed/hT_nvWreIhg",
          unlocked: true,
          watched: false,
        },
      ];
    else
      return [
        {
          id: 1,
          title: "Session (1) – PMI & PMP Introduction",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          unlocked: false,
          watched: false,
        },
        {
          id: 2,
          title: "Session (2) – Framework Part 1",
          duration: "3:00",
          videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
          unlocked: true,
          watched: false,
        },
        {
          id: 3,
          title: "Session (3) – Framework Part 2",
          duration: "3:00",
          videoUrl: "https://www.youtube.com/embed/l482T0yNkeo",
          unlocked: true,
          watched: false,
        },
        {
          id: 4,
          title: "Session (4) – Agile",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/3tmd-ClpJxA",
          unlocked: true,
          watched: false,
        },
        {
          id: 5,
          title: "Session (5) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/2Vv-BfVoq4g",
          unlocked: true,
          watched: false,
        },
        {
          id: 6,
          title: "Session (6) – 49 Processes",
          duration: "4:00",
          videoUrl: "https://www.youtube.com/embed/fLexgOxsZu0",
          unlocked: true,
          watched: false,
        },
        {
          id: 7,
          title: "Session (7) – Integration",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/60ItHLz5WEA",
          unlocked: true,
          watched: false,
        },
        {
          id: 8,
          title: "Session (8) – Scope",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
          unlocked: true,
          watched: false,
        },
        {
          id: 9,
          title: "Session (9) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/CevxZvSJLk8",
          unlocked: true,
          watched: false,
        },
        {
          id: 10,
          title: "Session (10) – Schedule",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/YQHsXMglC9A",
          unlocked: true,
          watched: false,
        },
        {
          id: 11,
          title: "Session (11) – Cost",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/OPf0YbXqDm0",
          unlocked: true,
          watched: false,
        },
        {
          id: 12,
          title: "Session (12) – Quality",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/JGwWNGJdvx8",
          unlocked: true,
          watched: false,
        },
        {
          id: 13,
          title: "Session (13) – Resource",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/ktvTqknDobU",
          unlocked: true,
          watched: false,
        },
        {
          id: 14,
          title: "Session (14) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/450p7goxZqg",
          unlocked: true,
          watched: false,
        },
        {
          id: 15,
          title: "Session (15) – Communication",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/09R8_2nJtjg",
          unlocked: true,
          watched: false,
        },
        {
          id: 16,
          title: "Session (16) – Risk",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/RgKAFK5djSk",
          unlocked: true,
          watched: false,
        },
        {
          id: 17,
          title: "Session (17) – Procurement",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/pRpeEdMmmQ0",
          unlocked: true,
          watched: false,
        },
        {
          id: 18,
          title: "Session (18) – Stakeholders",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/7wtfhZwyrcc",
          unlocked: true,
          watched: false,
        },
        {
          id: 19,
          title: "Session (19) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/e-ORhEE9VVg",
          unlocked: true,
          watched: false,
        },
        {
          id: 20,
          title: "Session (20) – Revision",
          duration: "3:00",
          videoUrl: "https://www.youtube.com/embed/hT_nvWreIhg",
          unlocked: true,
          watched: false,
        },
      ];
  });

  courseContent = computed(() => {
    if (this.certification() == 'pmp')
      return [
        { title: "Session (1) – PMI & PMP Introduction", duration: "2:00" },
        { title: "Session (2) – Framework Part 1", duration: "3:00" },
        { title: "Session (3) – Framework Part 2", duration: "3:00" },
        { title: "Session (4) – Agile", duration: "2:00" },
        { title: "Session (5) – Questions", duration: "2:00" },
        { title: "Session (6) – 49 Processes", duration: "4:00" },
        { title: "Session (7) – Integration", duration: "2:00" },
        { title: "Session (8) – Scope", duration: "2:00" },
        { title: "Session (9) – Questions", duration: "2:00" },
        { title: "Session (10) – Schedule", duration: "2:00" },
        { title: "Session (11) – Cost", duration: "2:00" },
        { title: "Session (12) – Quality", duration: "2:00" },
        { title: "Session (13) – Resource", duration: "2:00" },
        { title: "Session (14) – Questions", duration: "2:00" },
        { title: "Session (15) – Communication", duration: "2:00" },
        { title: "Session (16) – Risk", duration: "2:00" },
        { title: "Session (17) – Procurement", duration: "2:00" },
        { title: "Session (18) – Stakeholders", duration: "2:00" },
        { title: "Session (19) – Questions", duration: "2:00" },
        { title: "Session (20) – Revision", duration: "3:00" },
      ]
    else
      return [
        { title: "Session (1) – PMI & PMP Introduction", duration: "2:00" },
        { title: "Session (2) – Framework Part 1", duration: "3:00" },
        { title: "Session (3) – Framework Part 2", duration: "3:00" },
        { title: "Session (4) – Agile", duration: "2:00" },
        { title: "Session (5) – Questions", duration: "2:00" },
        { title: "Session (6) – 49 Processes", duration: "4:00" },
        { title: "Session (7) – Integration", duration: "2:00" },
        { title: "Session (8) – Scope", duration: "2:00" },
        { title: "Session (9) – Questions", duration: "2:00" },
        { title: "Session (10) – Schedule", duration: "2:00" },
        { title: "Session (11) – Cost", duration: "2:00" },
        { title: "Session (12) – Quality", duration: "2:00" },
        { title: "Session (13) – Resource", duration: "2:00" },
        { title: "Session (14) – Questions", duration: "2:00" },
        { title: "Session (15) – Communication", duration: "2:00" },
        { title: "Session (16) – Risk", duration: "2:00" },
        { title: "Session (17) – Procurement", duration: "2:00" },
        { title: "Session (18) – Stakeholders", duration: "2:00" },
        { title: "Session (19) – Questions", duration: "2:00" },
        { title: "Session (20) – Revision", duration: "3:00" },
      ]

  })

  courseResource = computed(() => {
    if (this.certification() == 'pmp')
      return [
        {
          type: "pdf",
          name: "PMP Study Guide",
          src: "/resources/pmp-study-guide.pdf",
        },
        {
          type: "presentation",
          name: "PMP Framework Overview",
          src: "/resources/pmp-framework.pptx",
        },
        {
          type: "image",
          name: "49 Processes Chart",
          src: "/resources/49-processes.png",
        },
        {
          type: "pdf",
          name: "Agile Practice Guide",
          src: "/resources/agile-practice-guide.pdf",
        },
        {
          type: "presentation",
          name: "Risk Management Slides",
          src: "/resources/risk-management.pptx",
        },
        {
          type: "image",
          name: "Process Groups Flow",
          src: "/resources/process-groups-flow.jpg",
        },
      ];
    else
      return [];
  })

  targetAudiences = computed(() => {
    if (this.certification() == 'pmp')
      return [
        "Experienced project managers ",
        "PMO members",
        "Consultant",
        "Department Heads",
        "Team leads",
      ];
    else
      return [];
  })
  enrollImage = 'assets/images/enroll.png';
  recoedImage = "assets/images/recordedCourse.jpeg";


  buyNow() {
    // Implement buy logic (e.g. open checkout, call service, etc.)
    console.log('Buy Now clicked');
  }

  addToCart() {
    // Implement add to cart logic
    console.log('Add to Cart clicked');
  }
}
