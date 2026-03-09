// src\app\app.routes.ts
import { CanMatchFn, Routes } from '@angular/router';

import { AboutComponent } from './components/ClientSide/about/about.component';
import { AdminLayoutComponent } from './components/AdminPanel/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/AdminPanel/dashboard/dashboard.component';

import { CertificationsComponent } from './components/AdminPanel/certifications/certifications.component';
import { CertificationsListComponent } from './components/AdminPanel/certifications/certifications-list/certifications-list.component';
import { CertificationComponent } from './components/AdminPanel/certifications/certification/certification.component';
import { CreateNewCertificationComponent } from './components/AdminPanel/certifications/create-new-certification/create-new-certification.component';
import { CreateNewExamComponent } from './components/AdminPanel/create-new-exam/create-new-exam.component';
import { CertificationQuestionComponent } from './components/AdminPanel/certifications/certification-question/certification-question.component';
import { ExamDetailsComponent } from './components/AdminPanel/exam-details/exam-details.component';
import { StudentsComponent } from './components/AdminPanel/students/students.component';
import { StudentReservedCoursesComponent } from './components/AdminPanel/students/student-reserved-courses/student-reserved-courses.component';
import { HomeComponent } from './components/ClientSide/home/home.component';
import { ClientSideLayoutComponent } from './shared/client-side-layout/client-side-layout.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { CalendarComponent } from './components/ClientSide/calendar/calendar.component';
import { CertificationsComponent as clientCertifications } from './components/ClientSide/certifications/certifications.component';

import { ArticlesComponent } from './components/ClientSide/articles/articles.component';
import { FAQsComponent } from './components/ClientSide/faqs/faqs.component';
import { ContactComponent } from './components/ClientSide/contact/contact.component';
import { PmpComponent } from './components/ClientSide/certifications/pmp/pmp.component';
import { CampComponent } from './components/ClientSide/certifications/camp/camp.component';
import { ServicesComponent } from './components/services/services.component';
import { ManpowerComponent } from './components/ClientSide/services/manpower/manpower.component';
import { PmoComponent } from './components/ClientSide/services/pmo/pmo.component';
import { MaturityAssessmentComponent } from './components/ClientSide/services/maturity-assessment/maturity-assessment.component';
import { PMISComponent } from './components/ClientSide/services/pmis/pmis.component';
import { TrainingComponent } from './components/ClientSide/services/training/training.component';
import { PostVacnacyComponent } from './components/ClientSide/services/manpower/post-vacnacy/post-vacnacy.component';
import { JobSeekerComponent } from './components/ClientSide/services/manpower/job-seeker/job-seeker.component';
import { LoginComponent } from './components/ClientSide/auth/login/login.component';
import { RegisterComponent } from './components/ClientSide/auth/register/register.component';
import { ProfileComponent } from './components/ClientSide/auth/profile/profile.component';
import { AuthComponent } from './components/ClientSide/auth/auth.component';
import { LiveCourseComponent } from './components/ClientSide/certifications/live-course/live-course.component';
import { QuizGameComponent } from './components/ClientSide/certifications/quiz-game/quiz-game.component';
import { ReviewsComponent } from './components/ClientSide/certifications/reviews/reviews.component';
import { clientAuthGuard, clientGuestGuard } from './Guards/ClientSideGuards/client-auth-guard';
import { CalculatorComponent } from './shared/calculator/calculator.component';
import { RefundPolicyComponent } from './components/ClientSide/refund-policy/refund-policy.component';
import { PrivacyNoticeComponent } from './components/ClientSide/privacy-notice/privacy-notice.component';
import { UserAccountPolicyComponent } from './components/ClientSide/user-account-policy/user-account-policy.component';
import { TechnicalSupportPolicyComponent } from './components/ClientSide/technical-support-policy/technical-support-policy.component';
import { CartComponent } from './components/ClientSide/cart/cart.component';
import { CheckoutComponent } from './components/ClientSide/checkout/checkout.component';
import { checkoutGuard } from './Guards/ClientSideGuards/checkout.guard';
import { PerformanceLevelsComponent } from '../components/ClientSide/performance-levels/performance-levels.component';

export const validLangGuard: CanMatchFn = (route, segments) => {
  const lang = segments[0]?.path;
  return lang === 'en' || lang === 'ar';
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'en',
    pathMatch: 'full',
  },
  {
    path: ':lang',
    canMatch: [validLangGuard],
    component: ClientSideLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'calendar',
        component: CalendarComponent,
      },
      {
        path: 'articles',
        component: ArticlesComponent,
      },
      {
        path: 'performance-levels',
        component: PerformanceLevelsComponent,
      },
      {
        path: 'faq',
        component: FAQsComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },
      {
        path: 'refund-policy',
        component: RefundPolicyComponent
      },
      {
        path: "privacy-notice",
        component: PrivacyNoticeComponent
      },
      {
        path: "user-account-policy",
        component: UserAccountPolicyComponent
      },
      {
        path: "technical-support-policy",
        component: TechnicalSupportPolicyComponent
      },
      {
        path: "cart",
        canActivate: [clientAuthGuard],
        component: CartComponent
      },
      {
        path: "checkout",
        component: CheckoutComponent,
        canActivate: [checkoutGuard]
      },
      {
        path: 'certifications',
        component: clientCertifications,
        children: [
          {
            path: '',
            redirectTo: "pmp",
            pathMatch: 'full',
          },
          {
            path: "pmp",
            component: PmpComponent,
            children: getCertificationChildren()

          },
          {
            path: "capm",
            component: CampComponent,
            children: getCertificationChildren()
          }

        ]
      },
      {
        path: 'services',
        component: ServicesComponent,
        children: [
          {
            path: '',
            redirectTo: "pmo",
            pathMatch: 'full',

          },
          {
            path: "manpower",
            component: ManpowerComponent,
            children: [
              {
                path: '',
                redirectTo: "post-vacancy",
                pathMatch: 'full',

              },
              {
                path: 'post-vacancy',
                component: PostVacnacyComponent
              },
              {
                path: 'job-seeker',
                component: JobSeekerComponent
              }
            ]
          },
          {
            path: "pmo",
            component: PmoComponent
          },
          {
            path: "maturity-assessment",
            component: MaturityAssessmentComponent
          },
          {
            path: "pmis",
            component: PMISComponent
          },
          {
            path: "training",
            component: TrainingComponent
          }

        ]
      },
      {
        path: 'auth',
        component: AuthComponent,
        children: [
          {
            path: '',
            redirectTo: "login",
            pathMatch: "full"
          },
          {
            path: "login",
            component: LoginComponent,
            canActivate: [clientGuestGuard]

          },
          {
            path: "register",
            component: RegisterComponent,
            canActivate: [clientGuestGuard]

          },
          {
            path: "profile",
            component: ProfileComponent,
            canActivate: [clientAuthGuard]

          },
        ]
      },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    data: { breadcrumb: 'Admin' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'certifications',
        component: CertificationsComponent,
        data: { breadcrumb: 'Certifications' },
        children: [
          {
            path: '',
            component: CertificationsListComponent,
            data: { breadcrumb: 'All' },
          },
          {
            path: 'create',
            component: CreateNewCertificationComponent,
            data: { breadcrumb: 'Create' },
          },
          {
            path: ':id/questions/:questionId',
            component: CertificationQuestionComponent,
            data: { breadcrumb: 'Question Details' },
          },
          {
            path: ':id/exams/create',
            component: CreateNewExamComponent,
            data: { breadcrumb: 'Create Exam' },
          },
          {
            path: ':id/exams/exam/:examId',
            component: ExamDetailsComponent,
            data: { breadcrumb: 'Exam Details' },
          },
          {
            path: ':id/exams/:examId/question/create',
            component: CertificationQuestionComponent,
            data: { breadcrumb: 'Create Question' },
          },
          {
            path: ':id/edit',
            component: CreateNewCertificationComponent,
            data: { breadcrumb: 'Edit' },
          },
          {
            path: ':id',
            component: CertificationComponent,
            data: { breadcrumb: 'Certification Details' },
          },

        ],
      },
      {
        path: 'students/:id/courses',
        component: StudentReservedCoursesComponent,
        data: { breadcrumb: 'Reserved Courses' },
      },
      {
        path: 'students',
        component: StudentsComponent,
        data: { breadcrumb: 'Students' },
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];


function getCertificationChildren(): Routes {
  return [
    {
      path: '',
      redirectTo: 'exam-simulator',
      pathMatch: 'full'
    },
    {
      path: 'exam-simulator',
      loadComponent: () =>
        import('./components/ClientSide/certifications/exam-simulator/exam-simulator.component')
          .then(m => m.ExamSimulatorComponent)
    },
    {
      path: 'recorded-course',
      loadComponent: () =>
        import('./components/ClientSide/certifications/recorded-course/recorded-course.component')
          .then(m => m.RecordedCourseComponent)
    },
    {
      path: 'live-course',
      loadComponent: () =>
        import('./components/ClientSide/certifications/live-course/live-course.component')
          .then(m => m.LiveCourseComponent)
    },
    {
      path: 'webinar',
      loadComponent: () =>
        import('./components/ClientSide/certifications/webinar/webinar.component')
          .then(m => m.WebinarComponent)
    },
    {
      path: 'articles',
      loadComponent: () =>
        import('./components/ClientSide/certifications/certification-articles/certification-articles.component')
          .then(m => m.CertificationArticlesComponent)
    },
    {
      path: 'quiz-game',
      loadComponent: () =>
        import('./components/ClientSide/certifications/quiz-game/quiz-game.component')
          .then(m => m.QuizGameComponent)
    },
    {
      path: 'faq',
      loadComponent: () =>
        import('./components/ClientSide/certifications/certification-faqs/certification-faqs.component')
          .then(m => m.CertificationFaqsComponent)
    },
    {
      path: 'reviews',
      loadComponent: () =>
        import('./components/ClientSide/certifications/reviews/reviews.component')
          .then(m => m.ReviewsComponent)
    },
    {
      path: 'quiz',
      loadComponent: () =>
        import('./components/ClientSide/certifications/quiz-game/quiz-game-question/quiz-game-question.component')
          .then(m => m.QuizGameQuestionComponent),
      data: { fullPage: true }
    },
    {
      path: 'reports',
      loadComponent: () =>
        import('./components/ClientSide/exam-reports/exam-reports.component')
          .then(m => m.ExamReportsComponent)
    },
    {
      path: 'exam-result',
      loadComponent: () =>
        import('./components/ClientSide/certifications/exam-result/exam-result.component')
          .then(m => m.ExamResultComponent),
                data: { fullPage: true }

    },
    {
      path: 'lesson-learned',
      loadComponent: () =>
        import('./components/ClientSide/exam-lesson-learned-questions/exam-lesson-learned-questions.component')
          .then(m => m.ExamLessonLearnedQuestionsComponent)
    },
    {
      path: 'chooseExam',
      loadComponent: () =>
        import('./components/ClientSide/certifications/choose-exam/choose-exam.component')
          .then(m => m.ChooseExamComponent),
    },
    {
      path: 'exams/:id',
      loadComponent: () =>
        import('./components/ClientSide/certifications/exam/exam.component')
          .then(m => m.ExamComponent),
      data: { fullPage: true }
    }
  ];
}
