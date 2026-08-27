// src\app\app.config.ts
import { APP_INITIALIZER, ApplicationConfig, inject, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideToastr } from 'ngx-toastr';
import { HttpLoaderFactory } from '../translate-loader';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { AuthInterceptor } from './core/interceptors/student-auth.interceptor';

export function localeFactory(translate: TranslateService) {
  return translate.currentLang === 'ar' ? 'ar-EG' : 'en-US';
}


export function initTranslate(translate: TranslateService) {
  return () => {
    const lang = translate.currentLang || 'en';

    return new Promise<void>((resolve) => {
      translate.use(lang).subscribe({
        next: () => resolve(),
        error: () => resolve()
      });
    });
  };
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
    {
      provide: APP_INITIALIZER,
      useFactory: initTranslate,
      deps: [TranslateService],
      multi: true
    },
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor, errorInterceptor])
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
