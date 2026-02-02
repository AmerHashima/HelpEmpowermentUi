// src\app\app.routes.server.ts

import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Client,
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
    path: 'about',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
