// src\app\app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideToastr } from 'ngx-toastr';
import { HttpLoaderFactory } from '../translate-loader';
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideAnimations(),
  provideToastr({
    timeOut: 3000,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    closeButton: true,
    progressBar: true,
    newestOnTop: false,
  }),
  provideRouter(routes),
  provideClientHydration(withEventReplay()),
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideHttpClient(),
  {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient]
  },
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    },
    fallbackLang: 'en'
  }).providers!
  ]
};
