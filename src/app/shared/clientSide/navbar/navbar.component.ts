import {
  Component,
  computed,
  effect,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Shared } from '../../Services/shared/shared';
import { Theme } from '../../Services/ThemeService/theme';
import { AuthService } from '../../../Services/auth.service';
import { CertificationsStore } from '../../../AdminPanelStores/CertificationStore/certification.store';
import { certifications } from '../certification-cards/certification-cards.component';
import { CartService } from '../../../Services/  cart.service';

@Component({
  selector: 'app-client-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [CertificationsStore]

})
export class ClientNavbarComponent {
  private certificationStore = inject(CertificationsStore);
  certifications = computed(() => this.certificationStore.certifications());
  private shared = inject(Shared);
  private auth = inject(AuthService);
  private cartService = inject(CartService);
  cartCount=this.cartService.cartCount;
  // loggedStudent =this.auth.loggedStudent
  isLoggedIn = computed(() => !!this.auth.studentToken());
  hydrated = signal(false);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  // Use shared service as single source of truth
  lang = this.shared.lang;
  currentTheme = signal<string | null>(null);
  isRTL = this.shared.isRtl;

  // Local component state
  currentPath = signal('');
  openDropdown = signal<string | null>(null);

  constructor() {

    effect(() => {
      const certs = this.certifications();
      this.shared.certifications.set(certs);
    });

    // React to route param :lang → delegate to shared service
    this.route.paramMap.subscribe(params => {
      const langParam = params.get('lang') as 'en' | 'ar' | null;
      if (langParam && ['en', 'ar'].includes(langParam)) {
        this.shared.useLanguage(langParam);
      }
    });

    // this.currentTheme.set(this.getTheme());

    // Keep track of current path for active link highlighting
    // effect(() => {
    //   this.router.events.subscribe(() => {
    //     this.currentPath.set(this.router.url);
    //     this.openDropdown.set(null);
    //   });
    // });

    this.router.events.subscribe(() => {
      this.currentPath.set(this.router.url);
      this.openDropdown.set(null);
    });
  }

  // ngOnInit() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const savedTheme = localStorage.getItem('theme') || 'light';
  //     document.documentElement.setAttribute('data-theme', savedTheme);
  //     this.hydrated.set(true);
  //   }
  // }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme.set(theme);
    this.shared.theme.set(theme);
    this.hydrated.set(true);
  }

  /** Toggle dropdown menu */
  toggleDropdown(key: string) {
    this.openDropdown.set(this.openDropdown() === key ? null : key);
  }

  /** Navigate to path */
  navigate(path: string) {
    this.router.navigateByUrl(path);
    this.openDropdown.set(null);
  }

  /** Change language → delegate to shared service */
  changeLang(newLang: 'en' | 'ar') {
    this.shared.useLanguage(newLang);

    // Optional: update URL to match new language prefix
    const current = this.currentPath();
    const newPath = current.replace(/^\/(en|ar)/, `/${newLang}`);
    this.router.navigateByUrl(newPath || `/${newLang}`);
  }

  /** Toggle dark/light theme */
  // toggleTheme() {

  //   if (!isPlatformBrowser(this.platformId)) return;

  //   const root = document.documentElement;
  //   const current = root.getAttribute('data-theme');
  //   const next = current === 'dark' ? 'light' : 'dark';
  //   root.setAttribute('data-theme', next);
  //   localStorage.setItem('theme', next);
  //   this.currentTheme.set(next);
  // }

  toggleTheme() {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = document.documentElement;
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';

    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);

    this.currentTheme.set(next);
    this.shared.theme.set(next);
  }

  // getTheme(): 'light' | 'dark' | null {
  //   if (!isPlatformBrowser(this.platformId)) return 'light';

  //   const root = document.documentElement;
  //   const current = root.getAttribute('data-theme') as 'light' | 'dark' | null;

  //   // fallback to localStorage if attribute not set
  //   return current ?? (localStorage.getItem('theme') as 'light' | 'dark' | null);
  // }
  getTheme(): 'light' | 'dark' {
    if (!isPlatformBrowser(this.platformId)) return 'light';

    return (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
  }

  logout(){
    this.auth.logout().subscribe({
      next:()=> this.router.navigateByUrl(`${this.lang()}/auth/login`)
    })
  }
  addToCart(){
    this.router.navigateByUrl(`/${this.lang()}/cart`);
  }
  /** Dynamic menu – uses current language from shared service */
  menu = computed(() => [
    {
      key: 'home',
      translateKey: 'menu.home',
      icon: 'bi bi-house',
      path: `/${this.lang()}`,
    },
    {
      key: 'about',
      translateKey: 'menu.about',
      icon: 'bi bi-info-circle',
      path: `/${this.lang()}/about`,
    },
    {
      key: 'certifications',
      translateKey: 'menu.certifications',
      icon: 'bi bi-patch-check',
      children: this.certifications().map(cert => ({
        translateKey: cert.courseName,
        icon: 'bi bi-clipboard',
        path: `/${this.lang()}/certifications/${cert.courseName.toLowerCase()}`,
      })),
    },
    // {
    //   key: 'certifications',
    //   translateKey: 'menu.certifications',
    //   icon: 'bi bi-patch-check',
    //   children: [
    //     {
    //       translateKey: 'menu.certifications_children.PMP',
    //       icon: 'bi bi-clipboard-check',
    //       path: `/${this.lang()}/certifications/pmp`,
    //     },
    //     {
    //       translateKey: 'menu.certifications_children.CAMP',
    //       icon: 'bi bi-clipboard',
    //       path: `/${this.lang()}/certifications/capm`,
    //     },
    //   ],
    // },
    {
      key: 'calendar',
      translateKey: 'menu.calendar',
      icon: 'bi bi-calendar',
      path: `/${this.lang()}/calendar`,
    },
    {
      key: 'services',
      translateKey: 'menu.services',
      icon: 'bi bi-briefcase',
      children: [
        {
          translateKey: 'menu.services_children.PMO',
          icon: 'bi bi-toolbox',
          path: `/${this.lang()}/services/pmo`,
        },
        {
          translateKey: 'menu.services_children.Maturityassessment',
          icon: 'bi bi-bars-progress',
          path: `/${this.lang()}/services/maturity-assessment`,
        },
        {
          translateKey: 'menu.services_children.pmis',
          icon: 'bi bi-circle-info',
          path: `/${this.lang()}/services/pmis`,
        },
        {
          translateKey: 'menu.services_children.manpower',
          icon: 'bi bi-tower-observation',
          path: `/${this.lang()}/services/manpower`,
        },

        {
          translateKey: 'menu.services_children.training',
          icon: 'bi bi-graduation-cap',
          path: `/${this.lang()}/services/training`,
        },
      ],
    },
    {
      key: 'articles',
      translateKey: 'menu.articles',
      icon: 'bi bi-newspaper',
      path: `/${this.lang()}/articles`,
    },
    {
      key: 'faq',
      translateKey: 'menu.faq',
      icon: 'bi bi-question-circle',
      path: `/${this.lang()}/faq`,
    },
    {
      key: 'contact',
      translateKey: 'menu.contact',
      icon: 'bi bi-headset',
      path: `/${this.lang()}/contact`,
    },
  ]);

  navigateHome(){
    this.router.navigateByUrl(`${this.lang()}/home`);
  }
}
