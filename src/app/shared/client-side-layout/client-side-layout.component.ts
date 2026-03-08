
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

import { ClientNavbarComponent } from '../clientSide/navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ClientMainLayoutComponent } from '../client-main-layout/client-main-layout.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { filter, map } from 'rxjs/operators';
import { Shared } from '../Services/shared/shared';

const SUPPORTED_LANGS = ['en', 'ar'];

@Component({
  selector: 'app-client-side-layout',
  standalone: true,
  imports: [
    ClientNavbarComponent,
    FooterComponent,
    ClientMainLayoutComponent,
    TranslatePipe,
  ],
  templateUrl: './client-side-layout.component.html',
  styleUrl: './client-side-layout.component.scss'
})
export class ClientSideLayoutComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
 private shared=inject(Shared);
  currentLang = 'en';
  isFullPage = false;
  isNoLayout = false;

  constructor() {
    // 1. Handle language from route param
    this.route.paramMap.subscribe(params => {
      let lang = params.get('lang') || 'en';

      // Invalid language → redirect to English
      if (!SUPPORTED_LANGS.includes(lang)) {
        this.router.navigate(['/en'], { replaceUrl: true });
        return;
      }

      this.currentLang = lang;
      this.translate.use(lang);

      // DOM + localStorage → only in browser
      if (isPlatformBrowser(this.platformId)) {
        this.document.documentElement.lang = lang;
        this.document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('preferredLang', lang);
      }
    });

    // 2. Handle layout flags from route data & URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let currentRoute = this.route.snapshot;

        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }

        return currentRoute.data ?? {};
      })
    ).subscribe(routeData => {
      this.isFullPage = !!routeData['fullPage'];
      this.shared.fullPage.set(this.isFullPage);
      this.isNoLayout = this.checkNoLayout(this.router.url);
    });
  }

  /**
   * Checks if current path should have NO layout (navbar/footer/etc.)
   */
  private checkNoLayout(pathname: string): boolean {
    const noLayoutPaths = [
      `/${this.currentLang}/home`,
      `/${this.currentLang}/certifications/pmp/exams/free`,
      `/${this.currentLang}/certifications/capm/exams/free`
    ];
    return noLayoutPaths.includes(pathname);
  }


  // get pageKey(): string {
  //   return this.router.url
  //     .replace(/^\/(en|ar)\//, '')
  //     .split('/')
  //     .pop() || 'home';
  // }
  get pageKey(): string {
    const url = this.router.url;

    // Remove language prefix
    const withoutLang = url.replace(/^\/(en|ar)/, '').replace(/^\//, '');

    // Split into segments
    const segments = withoutLang.split('/').filter(s => s.length > 0);
    // segments = ["certifications", "camp", "exam-simulator"]

    // Case 1: Under /certifications/ → return the certification type (camp / pmp / ...)
    if (segments.length >= 2 && segments[0] === 'certifications') {
      return segments[1];                           // "camp" or "pmp"
    }

    // Case 2: Fallback to last segment (or 'home')
    return segments[segments.length - 1] || 'home';
  }

  navigateHome(){
    this.router.navigateByUrl(`/${this.shared.lang()}/home`);
  }
}
