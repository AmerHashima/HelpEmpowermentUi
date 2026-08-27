// src\app\app.component.ts
import { Component, DestroyRef, ElementRef, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { isPlatformBrowser, DOCUMENT, AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './shared/Services/Loading/loading.service';
import { SpinnerComponent } from './shared/spinner/spinner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpinnerComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('screenshotDialogCloseButton')
  screenshotDialogCloseButton?: ElementRef<HTMLButtonElement>;

  title = 'Help Empowerment';
  loading$;
  screenshotWarningVisible = false;

  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private lastScreenshotAttemptAt = 0;

  private printScreenHandler = (e: KeyboardEvent): void => {
    const isPrintScreen = e.key === 'PrintScreen' || (e as any).keyCode === 44;
    const key = (e.key ?? '').toLowerCase();
    // Win + Shift + S (Snipping Tool) or Ctrl + Shift + S fallback in some environments.
    const isSnippingTool = e.shiftKey && key === 's' && (e.metaKey || e.ctrlKey);
    const isAltPrintScreen = e.altKey && (e.key === 'PrintScreen' || (e as any).keyCode === 44);

    if (isPrintScreen || isSnippingTool || isAltPrintScreen) {
      e.preventDefault();
      this.handlePotentialScreenshotAttempt();
    }
  };

  constructor(private loadingService: LoadingService) {
    if (isPlatformBrowser(this.platformId)) (window as any).__helpPhase?.('AppComponent: constructor');
    this.loading$ = this.loadingService.loading$;
    this.setupScreenshotProtection();
    if (isPlatformBrowser(this.platformId)) (window as any).__helpPhase?.('AppComponent: ready');
  }

  private setupScreenshotProtection(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const win = this.document.defaultView;
    if (!win) return;

    // Browsers vary here, so listen on both keydown and keyup at window + document level.
    win.addEventListener('keydown', this.printScreenHandler);
    win.addEventListener('keyup', this.printScreenHandler);
    this.document.addEventListener('keydown', this.printScreenHandler);
    this.document.addEventListener('keyup', this.printScreenHandler);

    this.destroyRef.onDestroy(() => {
      win.removeEventListener('keydown', this.printScreenHandler);
      win.removeEventListener('keyup', this.printScreenHandler);
      this.document.removeEventListener('keydown', this.printScreenHandler);
      this.document.removeEventListener('keyup', this.printScreenHandler);
    });
  }

  closeScreenshotWarning(): void {
    this.screenshotWarningVisible = false;
  }

  private handlePotentialScreenshotAttempt(): void {
    const now = Date.now();
    if (now - this.lastScreenshotAttemptAt < 800) return;

    this.lastScreenshotAttemptAt = now;
    this.showScreenshotWarning();
  }

  private showScreenshotWarning(): void {
    this.screenshotWarningVisible = true;

    const win = this.document.defaultView;
    if (!win) return;

    win.requestAnimationFrame(() => {
      this.screenshotDialogCloseButton?.nativeElement.focus();
    });
  }
}
