// src\app\app.config.ts
import { ApplicationConfig, inject, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, withIncrementalHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideToastr } from 'ngx-toastr';
import { HttpLoaderFactory } from '../translate-loader';
import { studentAuthInterceptor } from './core/interceptors/student-auth.interceptor';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { errorInterceptor } from './core/interceptors/error-interceptor';

export function localeFactory(translate: TranslateService) {
  return translate.currentLang === 'ar' ? 'ar-EG' : 'en-US';
}

registerLocaleData(localeAr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'top', 
      anchorScrolling: 'enabled'
    })),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
      newestOnTop: false,
    }),
    {
      provide: LOCALE_ID,
      useFactory: localeFactory,
      deps: [TranslateService]
    },
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([studentAuthInterceptor, errorInterceptor])
    ),    {
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
