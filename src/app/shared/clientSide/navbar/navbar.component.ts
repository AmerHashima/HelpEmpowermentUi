// src\app\shared\clientSide\navbar\navbar.component.ts
//   Component,
//   computed,
//   effect,
//   inject,
//   signal,
//   PLATFORM_ID,
// } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { Router, RouterModule, ActivatedRoute } from '@angular/router';
// import { TranslatePipe, TranslateService } from '@ngx-translate/core';

// @Component({
//   selector: 'app-client-navbar',
//   standalone: true,
//   imports: [CommonModule, RouterModule, TranslatePipe],
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.scss'],
// })
// export class ClientNavbarComponent {
//   private router = inject(Router);
//   private route = inject(ActivatedRoute);
//   private translate = inject(TranslateService);
//   private platformId = inject(PLATFORM_ID);

//   // Signals
//   lang = signal<'en' | 'ar'>('en');
//   currentPath = signal('');
//   openDropdown = signal<string | null>(null);
//   isRTL = computed(() => this.lang() === 'ar');

//   constructor() {
//     // Watch route params for language
//     effect(() => {
//       //console.log('in nav route effect');
//       this.route.paramMap.subscribe(params => {
//         const l = params.get('lang') as 'en' | 'ar';
//         if (l) {
//           this.lang.set(l);
//           this.translate.use(l);

//           // Only run DOM operations in the browser
//           if (isPlatformBrowser(this.platformId)) {
//             document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
//           }
//         }
//       });

//       // Watch router events for path updates
//       this.router.events.subscribe(() => {
//         this.currentPath.set(this.router.url);
//         this.openDropdown.set(null);
//       });
//     });
//   }

//   ngOnInit() {
//     if (isPlatformBrowser(this.platformId)) {
//       // get saved theme from localStorage, default to 'light'
//       const savedTheme = localStorage.getItem('theme') || 'light';
//       // apply it to the root element as data-theme
//       document.documentElement.setAttribute('data-theme', savedTheme);
//     }
//   }

//   /** Toggle dropdown menu */
//   toggleDropdown(key: string) {
//     this.openDropdown.set(this.openDropdown() === key ? null : key);
//   }

//   /** Navigate to a path */
//   navigate(path: string) {
//     this.router.navigateByUrl(path);
//     this.openDropdown.set(null);
//   }

//   /** Change language dynamically */
//   changeLang(newLang: 'en' | 'ar') {
//     const newPath = this.currentPath().replace(/^\/(en|ar)/, `/${newLang}`);
//     this.router.navigateByUrl(newPath);
//   }

//   /** Toggle dark/light theme */
//   toggleTheme() {
//     if (isPlatformBrowser(this.platformId)) {
//       const root = document.documentElement;
//       const current = root.getAttribute('data-theme');
//       const next = current === 'dark' ? 'light' : 'dark';
//       root.setAttribute('data-theme', next);
//       localStorage.setItem('theme', next);
//     }
//   }

//   /** Dynamic menu definition */
//   menu = computed(() => [
//     {
//       key: 'home',
//       translateKey: 'menu.home',
//       icon: 'bi bi-house',
//       path: `/${this.lang()}`,
//     },
//     {
//       key: 'about',
//       translateKey: 'menu.about',
//       icon: 'bi bi-info-circle',
//       path: `/${this.lang()}/about`,
//     },
//     {
//       key: 'certifications',
//       translateKey: 'menu.certifications',
//       icon: 'bi bi-patch-check',
//       children: [
//         {
//           translateKey: 'menu.certifications_children.PMP',
//           icon: 'bi bi-clipboard-check',
//           path: `/${this.lang()}/certifications/PMP`,
//         },
//         {
//           translateKey: 'menu.certifications_children.CAMP',
//           icon: 'bi bi-clipboard',
//           path: `/${this.lang()}/certifications/CAMP`,
//         },
//       ],
//     },
//     {
//       key: 'calendar',
//       translateKey: 'menu.calendar',
//       icon: 'bi bi-calendar',
//       path: `/${this.lang()}/calendar`,
//     },
//     {
//       key: 'services',
//       translateKey: 'menu.services',
//       icon: 'bi bi-briefcase',
//       children: [
//         {
//           translateKey: 'menu.services_children.CAMP',
//           icon: 'bi bi-tower-observation',
//           path: `/${this.lang()}/services/manpower`,
//         },
//         {
//           translateKey: 'menu.services_children.PMO',
//           icon: 'bi bi-toolbox',
//           path: `/${this.lang()}/services/pmo`,
//         },
//         {
//           translateKey: 'menu.services_children.Maturityassessment',
//           icon: 'bi bi-bars-progress',
//           path: `/${this.lang()}/services/maturity-assessment`,
//         },
//         {
//           translateKey: 'menu.services_children.pmis',
//           icon: 'bi bi-circle-info',
//           path: `/${this.lang()}/services/pmis`,
//         },
//         {
//           translateKey: 'menu.services_children.training',
//           icon: 'bi bi-graduation-cap',
//           path: `/${this.lang()}/services/training`,
//         },
//       ],
//     },
//     {
//       key: 'articles',
//       translateKey: 'menu.articles',
//       icon: 'bi bi-newspaper',
//       path: `/${this.lang()}/articles`,
//     },
//     {
//       key: 'faq',
//       translateKey: 'menu.faq',
//       icon: 'bi bi-question-circle',
//       path: `/${this.lang()}/faq`,
//     },
//     {
//       key: 'contact',
//       translateKey: 'menu.contact',
//       icon: 'bi bi-headset',
//       path: `/${this.lang()}/contact`,
//     },
//   ]);
// }
// src/app/components/client-navbar/client-navbar.component.ts
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

@Component({
  selector: 'app-client-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class ClientNavbarComponent {
  private shared = inject(Shared);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  // Use shared service as single source of truth
  lang = this.shared.lang;
  isRTL = this.shared.isRtl;

  // Local component state
  currentPath = signal('');
  openDropdown = signal<string | null>(null);

  constructor() {
    // React to route param :lang → delegate to shared service
    this.route.paramMap.subscribe(params => {
      const langParam = params.get('lang') as 'en' | 'ar' | null;
      if (langParam && ['en', 'ar'].includes(langParam)) {
        this.shared.useLanguage(langParam);
      }
    });

    // Keep track of current path for active link highlighting
    effect(() => {
      this.router.events.subscribe(() => {
        this.currentPath.set(this.router.url);
        this.openDropdown.set(null);
      });
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
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
  toggleTheme() {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
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
      children: [
        {
          translateKey: 'menu.certifications_children.PMP',
          icon: 'bi bi-clipboard-check',
          path: `/${this.lang()}/certifications/PMP`,
        },
        {
          translateKey: 'menu.certifications_children.CAMP',
          icon: 'bi bi-clipboard',
          path: `/${this.lang()}/certifications/CAMP`,
        },
      ],
    },
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
          translateKey: 'menu.services_children.manpower',
          icon: 'bi bi-tower-observation',
          path: `/${this.lang()}/services/manpower`,
        },
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
}
