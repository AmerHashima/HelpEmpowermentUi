// src\app\app.routes.server.ts

import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Client-facing pages with SSR
  // { path: ':lang', renderMode: RenderMode.Server },
  // { path: ':lang/home', renderMode: RenderMode.Server },
  // { path: ':lang/about', renderMode: RenderMode.Server },
  // { path: ':lang/calendar', renderMode: RenderMode.Server },
  // { path: ':lang/articles', renderMode: RenderMode.Server },
  // { path: ':lang/faq', renderMode: RenderMode.Server },
  // { path: ':lang/contact', renderMode: RenderMode.Server },
  // { path: ':lang/certifications/**', renderMode: RenderMode.Server },
  // { path: ':lang/services/**', renderMode: RenderMode.Server },

  // // Admin routes → client-only
  // { path: 'admin', renderMode: RenderMode.Client },
  // { path: 'admin/dashboard', renderMode: RenderMode.Client },
  // { path: 'admin/certifications/**', renderMode: RenderMode.Client },

  // // Fallback → server render
  // { path: '**', renderMode: RenderMode.Server },

  { path: ':lang', renderMode: RenderMode.Server },
  { path: ':lang/**', renderMode: RenderMode.Server },
  { path: 'admin/**', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Server },
];
