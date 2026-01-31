// src\app\app.routes.ts
import { AboutComponent } from './components/about/about.component';
import { AdminLayoutComponent } from './components/AdminPanel/admin-layout/admin-layout.component';
import { CertificationsComponent } from './components/AdminPanel/certifications/certifications.component';
import { DashboardComponent } from './components/AdminPanel/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'certifications',
        component: CertificationsComponent,
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
    component: AboutComponent
  },
];
