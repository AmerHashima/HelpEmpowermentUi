// src\app\shared\Admin Panel\navbar\navbar.ts
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Theme } from '../../Services/ThemeService/theme';
import { Shared } from "../../Services/shared/shared"


@Component({
  selector: 'app-navbar',
  imports: [TranslateModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  standalone: true
})
export class Navbar {
  private shared = inject(Shared);
  private theme = inject(Theme);
  private translateService = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);

  lang = this.shared.lang;
  isCollapse = this.shared.isCollapse;
  page = this.shared.page;

  toggleSidebar() {
    if (isPlatformBrowser(this.platformId)) {
      this.isCollapse.set(!this.isCollapse());
      this.shared.setIsCollapsed();
    }
  }

  switchLang() {
    const newLang = this.lang() === 'ar' ? 'en' : 'ar';
    this.lang.set(newLang);

    // Only run browser code
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('preferredLang', newLang);
      this.translateService.use(newLang);
    }
  }

  switchTheme() {
    if (isPlatformBrowser(this.platformId)) {
      this.theme.toggleTheme();
    }
  }
}
