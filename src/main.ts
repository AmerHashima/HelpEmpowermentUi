// src\main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

(window as any).__helpPhase?.('main: before bootstrap');
bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    (window as any).__helpPhase?.('main: bootstrap resolved');
    window.dispatchEvent(new Event('help-angular-ready'));
  })
  .catch((err) => {
    console.error(err);
    window.dispatchEvent(new CustomEvent('help-angular-error', {
      detail: err instanceof Error
        ? (err.stack || `${err.name}: ${err.message}`)
        : String(err),
    }));
  });
