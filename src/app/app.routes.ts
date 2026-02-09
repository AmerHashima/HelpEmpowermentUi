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
      }
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
