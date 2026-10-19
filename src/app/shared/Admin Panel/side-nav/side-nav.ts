// src\app\shared\Admin Panel\side-nav\side-nav.ts
import {
  Component,
  computed,
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
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Navitem } from '../../../models/navitem';
import { Shared } from '../../Services/shared/shared';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { ToastingMessagesService } from '../../Services/ToastingMessages/toasting-messages.service';
import { RoleService } from '../../../Services/role.service';
import { forkJoin, map, of, switchMap } from 'rxjs';


@Component({
  selector: 'app-side-nav',
  imports: [SideNavItem, CommonModule, TranslateModule],
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
  private auth = inject(AuthService);
  private router=inject(Router);
  private toasting=inject(ToastingMessagesService);
  private rolesService = inject(RoleService);
  lang = this.shared.lang;
  isCollapse = this.shared.isCollapse;
  previousIndex: number = -1;
  smallScreen = signal(false);
  isAdmin = computed(() => this.auth.loggedAdmin()?.roles.some(role => role.toLowerCase() === 'admin') ?? false);
  /** Normalized admin paths a non-admin role is allowed to read. */
  visibleAdminPaths = signal<Set<string>>(new Set());

  sectionOneNavItems: Navitem[] = [
    {
      name: 'Dashboard',
      nameAr: 'لوحة التحكم',
      icon: 'bi bi-house-door',
      route: 'dashboard'
    },
    {
      name: 'Reports',
      nameAr: 'التقارير',
      icon: 'bi bi-bar-chart-line',
      route: 'reports'
    },
    {
      name: 'Certifications',
      nameAr: 'الشهادات',
      icon: 'bi bi-patch-check-fill',
      route: 'certifications',
    },
    {
      name: 'Users',
      nameAr: 'المستخدمون',
      icon: 'bi bi-people-fill',
      route: 'students'
    },
    {
      name: 'Users Features Reservations',
      nameAr: 'المستخدمون',
      icon: 'bi bi-people-fill',
      route: 'students-table'
    },
    {
      name: 'Messages',
      nameAr: 'الرسائل',
      icon: 'bi bi-envelope-fill',
      route: 'contact-us'
    },
    {
      name: 'Live Course',
      nameAr: 'دورة مباشرة',
      icon: 'bi bi-broadcast',
      route: 'live-course'
    },
    {
      name: 'Webinar',
      nameAr: 'ندوة عبر الإنترنت',
      icon: 'bi bi-camera-video',
      route: 'webinar'
    },
    {

      name: 'Announcements',

      nameAr: 'الإعلانات',

      icon: 'bi bi-megaphone',

      route: 'announcements'

    },
    {
      name: 'Moderators',
      nameAr: 'المشرفون',
      icon: 'bi bi-person-badge',
      route: 'moderators'
    },
    {
      name: 'Roles',
      nameAr: 'الأدوار',
      icon: 'bi bi-shield-lock',
      route: 'roles'
    },
    {
      name: 'Articles',
      nameAr: 'المقالات',
      icon: 'bi bi-file-earmark-text',
      route: 'articles'
    },


  ];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.shared.setIsCollapsed();
      this.smallScreen.set(window.innerWidth < 768);
    }
    this.loadRolePermissions();
  }

  canShow(navItem: Navitem): boolean {
    // Admin remains unrestricted. Every other role must have an active
    // RoleLink with CanRead for the matching admin route.
    return this.isAdmin() || this.visibleAdminPaths().has(this.normalizeAdminPath(navItem.route));
  }

  private loadRolePermissions(): void {
    if (this.isAdmin()) {
      this.visibleAdminPaths.set(new Set(this.sectionOneNavItems.map(item => this.normalizeAdminPath(item.route))));
      return;
    }

    const assignedRoleNames = new Set(
      (this.auth.loggedAdmin()?.roles ?? []).map(role => role.trim().toLowerCase())
    );
    if (!assignedRoleNames.size) {
      this.visibleAdminPaths.set(new Set());
      return;
    }

    forkJoin({ roles: this.rolesService.search(), links: this.rolesService.links() }).pipe(
      switchMap(({ roles, links }) => {
        const matchingRoles = (roles.data ?? []).filter(role => assignedRoleNames.has(role.name.trim().toLowerCase()));
        if (!matchingRoles.length) return of(new Set<string>());

        return forkJoin(matchingRoles.map(role => this.rolesService.roleLinks(role.oid))).pipe(
          map(assignments => {
            const readableLinkIds = new Set(
              assignments.flat()
                .filter(item => item.isActive && item.canRead)
                .map(item => item.linkId)
            );

            return new Set(
              links
                .filter(link => link.isActive && readableLinkIds.has(link.oid))
                .map(link => this.normalizeAdminPath(link.path))
            );
          })
        );
      })
    ).subscribe({
      next: paths => this.visibleAdminPaths.set(paths),
      error: () => this.visibleAdminPaths.set(new Set())
    });
  }

  private normalizeAdminPath(path: string): string {
    const normalized = `/${(path ?? '').trim().replace(/^\/+|\/+$/g, '')}`.toLowerCase();
    return normalized.startsWith('/admin/') ? normalized : `/admin${normalized}`;
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
    // if (!this.isCollapse()) return;
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
    // if (!this.isCollapse()) return;

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

  logout() {
    this.auth.logout('admin').subscribe({
      next: () => this.router.navigateByUrl(`/admin/login`),
      error: () => this.toasting.showToast('Logout API failed(user already logged out locally)', 'warning')
    })
  }
}
