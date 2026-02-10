// src\app\app.routes.ts
import { Routes } from '@angular/router';

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

export const routes: Routes = [
    {  path: '',
    redirectTo: 'en',   // default language
    pathMatch: 'full',
  },
  {
    path: ':lang',
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
        path: 'faq',
        component: FAQsComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },
      {
        path: 'certifications',
        component: clientCertifications,
        children:[
          {
            path:'',
            redirectTo:"pmp",
            pathMatch: 'full',
          },
          {
               path:"PMP",
               component:PmpComponent
          },
          {
            path: "CAMP",
            component: CampComponent
          }

        ]
      },
      {
        path: 'services',
        component: ServicesComponent,
        children: [
          {
            path: '',
            redirectTo: "manpower",
            pathMatch: 'full',

          },
          {
            path: "manpower",
            component: ManpowerComponent,
            children:[
              {
                path: 'post-vacancy',
                component:PostVacnacyComponent
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
            pathMatch:"full"
          },
          {
            path: "login",
            component: LoginComponent
          },
          {
            path: "register",
            component: RegisterComponent
          },
          {
            path: "profile",
            component: ProfileComponent
          },
        ]
      },
    ]},
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
    ],
  },
  {
    path: '**',
    component:NotFoundComponent,
  },
];
