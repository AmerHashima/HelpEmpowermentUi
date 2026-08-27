// src\main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    window.dispatchEvent(new Event('help-angular-ready'));
  })
  .catch((err) => {
    console.error(err);
    window.dispatchEvent(new CustomEvent('help-angular-error', {
      detail: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
    }));
  });
