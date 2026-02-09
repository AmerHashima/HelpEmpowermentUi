// src\app\app.routes.server.ts

import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  {
    path: ':lang',
    renderMode: RenderMode.Server,
  },
  {
    path: ':lang/home',
    renderMode: RenderMode.Server,
  },
  {
    path: ':lang/about',
    renderMode: RenderMode.Prerender,
  },

  {
    path: 'admin',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin/dashboard',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin/certifications/**',
    renderMode: RenderMode.Client,
  },

  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
