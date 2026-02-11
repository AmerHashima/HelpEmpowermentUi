// // src\app\shared\Services\shared\shared.ts
// import { Injectable, Renderer2, RendererFactory2, signal, inject, PLATFORM_ID } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
// import { isPlatformBrowser } from '@angular/common';

// @Injectable({
//   providedIn: 'root'
// })
// export class Shared {
//   isCollapse = signal(false);
//   page = signal('Home');
//   lang = signal('en');
//   isRtl=signal(false);
//   private renderer: Renderer2;
//   private platformId = inject(PLATFORM_ID);

//   minLength = 3;
//   maxLength = 40;

//   constructor(
//     private translate: TranslateService,
//     rendererFactory: RendererFactory2
//   ) {
//     this.renderer = rendererFactory.createRenderer(null, null);
//     this.initLanguage();
//   }

//   initLanguage() {
//     if (!isPlatformBrowser(this.platformId)) return; // ✅ Skip on SSR

//     const savedLang = localStorage.getItem('preferredLang') || this.translate.getBrowserLang() || 'en';
//     const supportedLanguages = ['en', 'ar'];
//     const lang = supportedLanguages.includes(savedLang) ? savedLang : 'en';

//     this.translate.setDefaultLang('en');
//     this.translate.use(lang);
//     this.lang.set(lang);
//     this.setLangStyle(lang);

//     this.translate.onLangChange.subscribe(event => {
//       this.lang.set(event.lang);
//       this.setLangStyle(event.lang);
//     });
//   }

//   setLangStyle(lang: string) {
//     if (!isPlatformBrowser(this.platformId)) return;

//     const ltrLink = document.querySelector<HTMLLinkElement>('link[id="bootstrap-ltr"]');
//     const rtlLink = document.querySelector<HTMLLinkElement>('link[id="bootstrap-rtl"]');

//     if (ltrLink && rtlLink) {
//       this.renderer.setProperty(ltrLink, 'disabled', lang === 'ar');
//       this.renderer.setProperty(rtlLink, 'disabled', lang !== 'ar');
//       this.isRtl.set(lang === 'ar');
//       this.renderer.setAttribute(document.documentElement, 'dir', lang === 'ar' ? 'rtl' : 'ltr');
//     }
//   }

//   setIsCollapsed() {
//     if (!isPlatformBrowser(this.platformId)) return;
//     if (window.innerWidth < 768) this.isCollapse.set(true);
//   }

//   isValidLength(value: string): boolean {
//     return value.length >= this.minLength && value.length <= this.maxLength;
//   }
// }


// src/app/shared/services/shared/shared.service.ts
import { Injectable, RendererFactory2, Renderer2, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class Shared {
  // Signals
  isCollapse = signal(false);
  page = signal('Home');
  lang = signal<'en' | 'ar'>('en');
  isRtl = computed(() => this.lang() === 'ar');

  // Dependencies
  private platformId = inject(PLATFORM_ID);
  private translate = inject(TranslateService);
  private rendererFactory = inject(RendererFactory2);

  // Renderer — created safely
  private renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);

  constructor() {
    this.initLanguage();
  }

  private initLanguage() {
    if (!isPlatformBrowser(this.platformId)) {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      return;
    }

    const savedLang = localStorage.getItem('preferredLang');
    const browserLang = this.translate.getBrowserLang() || 'en';
    const initialLang = ['en', 'ar'].includes(savedLang!) ? savedLang : browserLang;

    this.useLanguage(initialLang as 'en' | 'ar');
  }

  useLanguage(lang: 'en' | 'ar') {
    if (!isPlatformBrowser(this.platformId)) return;

    this.translate.use(lang);

    this.lang.set(lang);

    localStorage.setItem('preferredLang', lang);

    this.updateDirectionAndStylesheets(lang);
  }

  /**
   * Updates document direction and toggles Bootstrap LTR/RTL stylesheets
   */
  private updateDirectionAndStylesheets(lang: 'en' | 'ar') {
    const isArabic = lang === 'ar';

    this.renderer.setAttribute(document.documentElement, 'dir', isArabic ? 'rtl' : 'ltr');

    // Toggle Bootstrap stylesheets
    const ltrLink = document.querySelector<HTMLLinkElement>('link[id="bootstrap-ltr"]');
    const rtlLink = document.querySelector<HTMLLinkElement>('link[id="bootstrap-rtl"]');

    if (ltrLink && rtlLink) {
      this.renderer.setProperty(ltrLink, 'disabled', isArabic);
      this.renderer.setProperty(rtlLink, 'disabled', !isArabic);
    }
  }


  setIsCollapsed() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.innerWidth < 768) {
      this.isCollapse.set(true);
    }
  }



}
