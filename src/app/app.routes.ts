// src\app\app.routes.ts
import { CanMatchFn, Routes } from '@angular/router';

import { HomeComponent } from './components/ClientSide/home/home.component';
import { ClientSideLayoutComponent } from './shared/client-side-layout/client-side-layout.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { clientAuthGuard, clientGuestGuard } from './Guards/ClientSideGuards/client-auth-guard';
import { checkoutGuard } from './Guards/ClientSideGuards/checkout.guard';
import { adminAuthGuard, adminGuestGuard } from './Guards/AdminSideGuards/Admin.guard';

export const validLangGuard: CanMatchFn = (route, segments) => {
  const lang = segments[0]?.path;
  return lang === 'en' || lang === 'ar';
};

export const routes: Routes = [
  { path: 'payment-result', loadComponent: () => import('./components/ClientSide/payment-result/payment-result.component').then(m => m.PaymentResultComponent) },
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
        loadComponent: () => import('./components/ClientSide/about/about.component').then(m => m.AboutComponent),
      },
      {
        path: 'calendar',
        loadComponent: () => import('./components/ClientSide/calendar/calendar.component').then(m => m.CalendarComponent),
      },
      {
        path: 'invoice',
        loadComponent: () => import('./components/ClientSide/client-invoice/client-invoice.component').then(m => m.ClientInvoiceComponent),
      },
      // {
      //   path: 'articles',
      //   component: ArticlesComponent,
      // },
      {
        path: 'articles',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/ClientSide/articles/articles.component').then(m => m.ArticlesComponent)
          },
          {
            path: ':category',
            children: [
              {
                path: '',
                loadComponent: () => import('./components/ClientSide/articles/articles.component').then(m => m.ArticlesComponent)
              },
              {
                path: ':slug',
                loadComponent: () =>
                  import('./components/ClientSide/articles/article-details/article-details.component')
                    .then(m => m.ArticleDetailsComponent)
              }
            ]
          }
        ]
      },
      {
        path: 'performance-levels',
        loadComponent: () => import('../components/ClientSide/performance-levels/performance-levels.component').then(m => m.PerformanceLevelsComponent),
      },
      {
        path: 'faq',
        loadComponent: () => import('./components/ClientSide/faqs/faqs.component').then(m => m.FAQsComponent),
      },
      {
        path: 'contact',
        loadComponent: () => import('./components/ClientSide/contact/contact.component').then(m => m.ContactComponent),
      },
      {
        path: 'refund-policy',
        loadComponent: () => import('./components/ClientSide/refund-policy/refund-policy.component').then(m => m.RefundPolicyComponent)
      },
      {
        path: 'cancellation-policy',
        loadComponent: () => import('./components/ClientSide/cancellation-policy/cancellation-policy.component').then(m => m.CancellationPolicyComponent)
      },
      {
        path: "privacy-notice",
        loadComponent: () => import('./components/ClientSide/privacy-notice/privacy-notice.component').then(m => m.PrivacyNoticeComponent)
      },
      {
        path: "terms-and-conditions",
        loadComponent: () => import('./components/ClientSide/terms-and-conditions/terms-and-conditions.component').then(m => m.TermsAndConditionsComponent)
      },
      {
        path: "cookie-policy",
        loadComponent: () => import('./components/ClientSide/cookie-policy/cookie-policy.component').then(m => m.CookiePolicyComponent)
      },
      {
        path: "user-account-policy",
        loadComponent: () => import('./components/ClientSide/user-account-policy/user-account-policy.component').then(m => m.UserAccountPolicyComponent)
      },


      {
        path: "technical-support-policy",
        loadComponent: () => import('./components/ClientSide/technical-support-policy/technical-support-policy.component').then(m => m.TechnicalSupportPolicyComponent)
      },
      {
        path: "cart",
        canActivate: [clientAuthGuard],
        loadComponent: () => import('./components/ClientSide/cart/cart.component').then(m => m.CartComponent)
      },
      {
        path: "checkout",
        loadComponent: () => import('./components/ClientSide/checkout/checkout.component').then(m => m.CheckoutComponent),
        canActivate: [checkoutGuard]
      },
      {
        path: 'certifications',
        loadComponent: () => import('./components/ClientSide/certifications/certifications.component').then(m => m.CertificationsComponent),
        children: [
          // {
          //   path: ':slug',
          //   component: SlugCertificationComponent,
          //   children: getCertificationChildren()
          // }
          {
            path: '',
            redirectTo: "pmp",
            pathMatch: 'full',
          },
          {
            path: "pmp",
            loadComponent: () => import('./components/ClientSide/certifications/pmp/pmp.component').then(m => m.PmpComponent),
            children: getCertificationChildren()

          },
          {
            path: "capm",
            loadComponent: () => import('./components/ClientSide/certifications/camp/camp.component').then(m => m.CampComponent),
            children: getCertificationChildren()
          }

        ]
      },
      {
        path: 'services',
        loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent),
        children: [
          {
            path: '',
            redirectTo: "pmo",
            pathMatch: 'full',

          },
          {
            path: "manpower",
            loadComponent: () => import('./components/ClientSide/services/manpower/manpower.component').then(m => m.ManpowerComponent),
            children: [
              {
                path: '',
                redirectTo: "post-vacancy",
                pathMatch: 'full',

              },
              {
                path: 'post-vacancy',
                loadComponent: () => import('./components/ClientSide/services/manpower/post-vacnacy/post-vacnacy.component').then(m => m.PostVacnacyComponent)
              },
              {
                path: 'job-seeker',
                loadComponent: () => import('./components/ClientSide/services/manpower/job-seeker/job-seeker.component').then(m => m.JobSeekerComponent)
              }
            ]
          },
          {
            path: "pmo",
            loadComponent: () => import('./components/ClientSide/services/pmo/pmo.component').then(m => m.PmoComponent)
          },
          {
            path: "maturity-assessment",
            loadComponent: () => import('./components/ClientSide/services/maturity-assessment/maturity-assessment.component').then(m => m.MaturityAssessmentComponent)
          },
          {
            path: "pmis",
            loadComponent: () => import('./components/ClientSide/services/pmis/pmis.component').then(m => m.PMISComponent)
          },
          {
            path: "training",
            loadComponent: () => import('./components/ClientSide/services/training/training.component').then(m => m.TrainingComponent)
          }

        ]
      },
      {
        path: 'auth',
        loadComponent: () => import('./components/ClientSide/auth/auth.component').then(m => m.AuthComponent),
        children: [
          {
            path: '',
            redirectTo: "login",
            pathMatch: "full"
          },
          {
            path: "login",
            loadComponent: () => import('./components/ClientSide/auth/login/login.component').then(m => m.LoginComponent),
            canActivate: [clientGuestGuard]

          },
          {
            path: "forget-password",
            loadComponent: () => import('./components/ClientSide/auth/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent),
            canActivate: [clientGuestGuard]
          },
          {
            path: "reset-password",
            loadComponent: () => import('./components/ClientSide/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
            canActivate: [clientGuestGuard]
          },
          {
            path: "verify-otp",
            loadComponent: () => import('./components/ClientSide/auth/reset-password-otp/reset-password-otp.component').then(m => m.ResetPasswordOTPComponent),
            canActivate: [clientGuestGuard]
          },
          {
            path: "register",
            loadComponent: () => import('./components/ClientSide/auth/register/register.component').then(m => m.RegisterComponent),
            canActivate: [clientGuestGuard]

          },
          {
            path: "profile",
            loadComponent: () => import('./components/ClientSide/auth/profile/profile.component').then(m => m.ProfileComponent),
            canActivate: [clientAuthGuard]

          },
        ]
      },
      {
        path: 'videos',
        loadComponent: () => import('./components/ClientSide/videos/videos.component').then(m => m.VideosComponent),
      },
      {
        path: ':search',
        loadComponent: () =>
          import('./components/ClientSide/search/search.component')
            .then(m => m.SearchComponent)
      },
    ]
  },
  {
    path: 'admin/login',
    canActivate: [adminGuestGuard],
    loadComponent: () => import('./components/AdminPanel/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/AdminPanel/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    data: { breadcrumb: 'Admin' },
    canActivateChild: [adminAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/AdminPanel/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'certifications',
        loadComponent: () => import('./components/AdminPanel/certifications/certifications.component').then(m => m.CertificationsComponent),
        data: { breadcrumb: 'Certifications' },
        children: [
          {
            path: '',
            loadComponent: () => import('./components/AdminPanel/certifications/certifications-list/certifications-list.component').then(m => m.CertificationsListComponent),
            data: { breadcrumb: 'All' },
          },
          {
            path: 'create',
            loadComponent: () => import('./components/AdminPanel/certifications/create-new-certification/create-new-certification.component').then(m => m.CreateNewCertificationComponent),
            data: { breadcrumb: 'Create' },
          },
          {
            path: ':id/questions/:questionId',
            loadComponent: () => import('./components/AdminPanel/certifications/certification-question/certification-question.component').then(m => m.CertificationQuestionComponent),
            data: { breadcrumb: 'Question Details' },
          },
          {
            path: ':id/exams/create',
            loadComponent: () => import('./components/AdminPanel/create-new-exam/create-new-exam.component').then(m => m.CreateNewExamComponent),
            data: { breadcrumb: 'Create Exam' },
          },
          {
            path: ':id/exams/:examId/edit',
            loadComponent: () => import('./components/AdminPanel/certifications/edit-exam/edit-exam.component').then(m => m.EditExamComponent),
            data: { breadcrumb: 'Edit Exam' },
          },
          {
            path: ':id/exams/exam/:examId',
            loadComponent: () => import('./components/AdminPanel/exam-details/exam-details.component').then(m => m.ExamDetailsComponent),
            data: { breadcrumb: 'Exam Details' },
          },
          {
            path: ':id/exams/:examId/question/create',
            loadComponent: () => import('./components/AdminPanel/certifications/certification-question/certification-question.component').then(m => m.CertificationQuestionComponent),
            data: { breadcrumb: 'Create Question' },
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./components/AdminPanel/certifications/create-new-certification/create-new-certification.component').then(m => m.CreateNewCertificationComponent),
            data: { breadcrumb: 'Edit' },
          },
          {
            path: ':id/videos/create',
            loadComponent: () => import('./components/AdminPanel/certifications/course-video-form/course-video-form.component').then(m => m.CourseVideoFormComponent),
            data: { breadcrumb: 'Create Course Video' },
          },
          {
            path: ':id/videos/:videoId/edit',
            loadComponent: () => import('./components/AdminPanel/certifications/course-video-form/course-video-form.component').then(m => m.CourseVideoFormComponent),
            data: { breadcrumb: 'Edit Course Video' },
          },
          {
            path: ':id',
            loadComponent: () => import('./components/AdminPanel/certifications/certification/certification.component').then(m => m.CertificationComponent),
            data: { breadcrumb: 'Certification Details' },
          },

        ],
      },
      {
        path: 'students/:id/courses',
        loadComponent: () => import('./components/AdminPanel/students/student-reserved-courses/student-reserved-courses.component').then(m => m.StudentReservedCoursesComponent),
        data: { breadcrumb: 'Reserved Courses' },
      },
      {
        path: 'students',
        loadComponent: () => import('./components/AdminPanel/students/students.component').then(m => m.StudentsComponent),
        data: { breadcrumb: 'Users' },
      },
      {
        path: 'students-table',
        loadComponent: () => import('./components/AdminPanel/students/student-export-table/student-export-table.component').then(m => m.StudentExportTableComponent),
        data: { breadcrumb: 'Users Feature Reservations' },
      },
      {
        path: 'articles',
        loadComponent: () => import('./components/AdminPanel/articles/articles.component').then(m => m.ArticlesComponent),
        data: { breadcrumb: 'Articles' },
      },
      {
        path: 'contact-us',
        loadComponent: () => import('./components/AdminPanel/contact-us/contact-us.component').then(m => m.AdminContactUsComponent),
        data: { breadcrumb: 'Contact Us' },
      },
      {
        path: 'webinar',
        loadComponent: () => import('./components/AdminPanel/Webinar/webinars/webinars.component').then(m => m.WebinarsComponent),
        data: { breadcrumb: 'Webinar' },
      },
      {
        path: 'announcements',
        loadComponent: () => import('./components/AdminSide/announcement/announcement.component').then(m => m.AnnouncementComponent),
        data: { breadcrumb: 'Announcements' },
      },

      {
        path: 'live-course',
        loadComponent: () => import('./components/AdminPanel/LiveCourse/live-courses/live-courses.component').then(m => m.LiveCoursesComponent),
        data: { breadcrumb: 'Live Course' },
      },
      {
        path: 'moderators',
        loadComponent: () => import('./components/AdminPanel/moderators/moderators.component').then(m => m.ModeratorsComponent),
        data: { breadcrumb: 'Moderators' },
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
    }, {
      path: 'download-certification',
      loadComponent: () =>
        import('./components/ClientSide/finish-certification/finish-certification.component')
          .then(m => m.FinishCertificationComponent),
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
      path: 'lesson-learned/practice',
      loadComponent: () =>
        import('./components/ClientSide/certifications/lesson-learned-questios-practice-mode/lesson-learned-questios-practice-mode.component')
          .then(m => m.LessonLearnedQUestiosPracticeModeComponent),
      data: { fullPage: true }
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
      data: { fullPage: true },
      // resolve: {
      //   questions: examQuestionsResolver
      // }
    },
    {
      path: 'free-exam/:id',
      loadComponent: () =>
        import('./components/ClientSide/certifications/free-exam/free-exam.component')
          .then(m => m.FreeExamComponent),
      data: { fullPage: true }
    }
  ];
}
