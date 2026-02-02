import { Routes } from '@angular/router';

import { AboutComponent } from './components/about/about.component';
import { AdminLayoutComponent } from './components/AdminPanel/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/AdminPanel/dashboard/dashboard.component';

import { CertificationsComponent } from './components/AdminPanel/certifications/certifications.component';
import { CertificationsListComponent } from './components/AdminPanel/certifications/certifications-list/certifications-list.component';
import { CertificationComponent } from './components/AdminPanel/certifications/certification/certification.component';
import { CreateNewCertificationComponent } from './components/AdminPanel/certifications/create-new-certification/create-new-certification.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/certifications',
    pathMatch: 'full',
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    data: { breadcrumb: 'Admin' },
    children: [
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
            path: ':id/edit',
            component: CreateNewCertificationComponent,
            data: { breadcrumb: 'Edit' },
          },
          {
            path: ':id',
            component: CertificationComponent,
            data: { breadcrumb: 'Details' },
          },

        ],
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: 'about',
    component: AboutComponent,
    data: { breadcrumb: 'About' },
  },

  // 404 fallback
  {
    path: '**',
    redirectTo: '',
  },
];
