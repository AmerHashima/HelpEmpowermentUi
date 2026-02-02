import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  breadcrumbs$ = new BehaviorSubject<BreadcrumbItem[]>([]);

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const root = this.router.routerState.snapshot.root;
      const crumbs = this.buildBreadcrumbs(root);
      this.breadcrumbs$.next(crumbs);
    });
  }

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    crumbs: BreadcrumbItem[] = []
  ): BreadcrumbItem[] {
    const routeURL = route.url.map(segment => segment.path).join('/');
    if (routeURL) {
      url += `/${routeURL}`;
    }

    if (route.data['breadcrumb']) {
      crumbs.push({
        label: route.data['breadcrumb'],
        url
      });
    }

    return route.firstChild
      ? this.buildBreadcrumbs(route.firstChild, url, crumbs)
      : crumbs;
  }
}



// @Injectable({ providedIn: 'root' })
// export class BreadcrumbService {
//   private breadcrumbsSubject = new BehaviorSubject<BreadcrumbItem[]>([]);
//   breadcrumbs$ = this.breadcrumbsSubject.asObservable();

//   constructor(private router: Router) {
//     this.router.events.subscribe(() => {
//       const root = this.router.routerState.snapshot.root;
//       const crumbs = this.buildBreadcrumbs(root);
//       this.breadcrumbsSubject.next(crumbs);
//     });
//   }

//   setBreadcrumbs(crumbs: BreadcrumbItem[]) {
//     this.breadcrumbsSubject.next(crumbs);
//   }

//   resetToRoute() {
//     const root = this.router.routerState.snapshot.root;
//     this.breadcrumbsSubject.next(this.buildBreadcrumbs(root));
//   }

//   private buildBreadcrumbs(
//     route: ActivatedRouteSnapshot,
//     url: string = '',
//     crumbs: BreadcrumbItem[] = []
//   ): BreadcrumbItem[] {
//     const routeURL = route.url.map(s => s.path).join('/');
//     if (routeURL) url += `/${routeURL}`;

//     if (route.data['breadcrumb']) {
//       crumbs.push({ label: route.data['breadcrumb'], url });
//     }

//     return route.firstChild
//       ? this.buildBreadcrumbs(route.firstChild, url, crumbs)
//       : crumbs;
//   }
// }
