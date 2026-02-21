
import { Injectable, RendererFactory2, Renderer2, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { certifications } from '../../clientSide/certification-cards/certification-cards.component';

@Injectable({
  providedIn: 'root'
})
export class Shared {
  // Signals
  isCollapse = signal(false);
  page = signal('Home');
  lang = signal<'en' | 'ar'>('en');
  isRtl = computed(() => this.lang() === 'ar');
  currentCertificate = signal('');
  certifications=signal<any>(null);
  currentCertificationObject = computed(() => {
    const certName = this.currentCertificate();
    const certs = this.certifications();
    if (!certName || !certs?.length) return null;
    const certification = certs.find((c: any) => c.courseName.toLowerCase() === certName) ?? null;
    return certification;
  });
  currentExamId = signal('');

  fullPage = signal<boolean>(false);

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
