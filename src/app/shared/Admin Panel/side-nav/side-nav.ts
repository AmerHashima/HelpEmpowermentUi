// src\app\shared\Admin Panel\side-nav\side-nav.ts
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  PLATFORM_ID,
  QueryList,
  signal,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { SideNavItem } from './side-nav-item/side-nav-item';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Navitem } from '../../../models/navitem';
import { Shared } from '../../Services/shared/shared';


@Component({
  selector: 'app-side-nav',
  imports: [SideNavItem, CommonModule, RouterLink, TranslateModule],
  templateUrl: './side-nav.html',
  styleUrls: ['./side-nav.scss'],
  standalone: true
})
export class SideNav {
  @ViewChild('sideNav') sideNav!: ElementRef;
  @ViewChildren('hoverSub') hoverSubs!: QueryList<ElementRef>;
  @ViewChild('searchPopup') searchPopup!: ElementRef;
  @ViewChild('searchIcon') searchIcon!: ElementRef;

  private shared = inject(Shared);
  private platformId = inject(PLATFORM_ID);

  lang = this.shared.lang;
  isCollapse = this.shared.isCollapse;
  previousIndex: number = -1;
  smallScreen = signal(false);

  sectionOneNavItems: Navitem[] = [
    {
      name: 'Dashboard',
      nameAr: 'لوحة التحكم',
      icon: 'bi bi-house-door',
      route: 'dashboard'
    },
    {
      name: 'Certifications',
      nameAr: 'الشهادات',
      icon: 'bi bi-patch-check-fill',
      route: 'certifications',
      subItems: [
        { name: 'PMP', nameAr: 'الأطباء', icon: 'bi bi-patch-check-fill', route: 'pmp' },
        { name: 'CAMP', nameAr: 'إضافةطبيب جديد', icon: 'bi bi-patch-check-fill', route: 'camp' },
      ]
    },
    {
      name: 'Services',
      nameAr: 'الخدمات',
      icon: 'bi bi-bullseye',
      route: 'services',
      subItems: [
        { name: 'service 1', nameAr: 'خدمة ١', icon: 'bi bi-bullseye', route: 'service1' },
        { name: 'service 2', nameAr: 'خدمة ٢', icon: 'bi bi-bullseye', route: 'service2' },
      ]
    },

  ];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.shared.setIsCollapsed();
      this.smallScreen.set(window.innerWidth < 768);
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.smallScreen.set(window.innerWidth < 768);
      this.shared.setIsCollapsed();
    }
  }

  showHoverSubMenu(index: number, event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.isCollapse()) return;
    if (this.previousIndex != -1) this.hideHoverSubMenu(this.previousIndex);

    const navItem = event.currentTarget as HTMLElement;
    const hoverSub = this.hoverSubs.toArray()[index]?.nativeElement;

    if (hoverSub && this.sideNav) {
      this.sideNav.nativeElement.appendChild(hoverSub);
      const rect = navItem.getBoundingClientRect();
      const sidebarRect = this.sideNav.nativeElement.getBoundingClientRect();

      hoverSub.style.position = 'absolute';
      if (this.lang() === 'ar') hoverSub.style.right = `${sidebarRect.width}px`;
      else hoverSub.style.left = `${sidebarRect.width}px`;
      hoverSub.style.top = `${rect.top - sidebarRect.top}px`;
      hoverSub.style.display = 'block';
    }
    this.previousIndex = index;
  }

  hideHoverSubMenu(index: number) {
    if (!isPlatformBrowser(this.platformId)) return;
    const hoverSub = this.hoverSubs.toArray()[index]?.nativeElement;
    if (hoverSub) hoverSub.style.display = 'none';
  }

  showSearchPopup(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.isCollapse()) return;

    const searchIcon = this.searchIcon?.nativeElement;
    const searchPopup = this.searchPopup?.nativeElement;

    if (searchPopup && this.sideNav && searchIcon) {
      this.sideNav.nativeElement.appendChild(searchPopup);
      const rect = searchIcon.getBoundingClientRect();
      const sidebarRect = this.sideNav.nativeElement.getBoundingClientRect();

      searchPopup.style.position = 'absolute';
      if (this.lang() === 'ar') searchPopup.style.right = `${sidebarRect.width}px`;
      else searchPopup.style.left = `${sidebarRect.width}px`;
      searchPopup.style.top = `${rect.top - sidebarRect.top}px`;
      searchPopup.style.display = 'block';
    }
  }

  hideSearchPopup() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.searchPopup?.nativeElement) {
      this.searchPopup.nativeElement.style.display = 'none';
    }
  }
}
