import { Component, computed, Inject, inject, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from '../../../../shared/Services/shared/shared';
import { IconCardComponent } from '../../../../shared/icon-card/icon-card.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home-services',
  imports: [IconCardComponent],
  templateUrl: './home-services.component.html',
  styleUrl: './home-services.component.scss'
})
export class HomeServicesComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private shared = inject(Shared);
  visibleCount = signal(3);
  isRTL = this.shared.isRtl;
  items = [
    {
      icon: "bi bi-diagram-3",
      title: "home.services.items.pmo.title",
      description: "home.services.items.pmo.description",
      route: "pmo",
    },
    {
      icon: "bi bi-clipboard-data",
      title: "home.services.items.maturity.title",
      description: "home.services.items.maturity.description",
      route: "maturity-assessment",
    },
    {
      icon: "bi bi-mortarboard",
      title: "home.services.items.training.title",
      description: "home.services.items.training.description",
      route: "training",
    },
    {
      icon: "bi bi-people",
      title: "home.services.items.manpower.title",
      description: "home.services.items.manpower.description",
      route: "manpower",
    },
    {
      icon: "bi bi-bar-chart",
      title: "home.services.items.pmis.title",
      description: "home.services.items.pmis.description",
      route: "pmis",
    }
  ];

  startIndex = signal(0);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.updateVisibleCount();

      window.addEventListener('resize', () => {
        this.updateVisibleCount();
      });
    }
  }

  updateVisibleCount() {
    const width = window.innerWidth;

    if (width < 768) {
      this.visibleCount.set(1);
    } else if (width < 992) {
      this.visibleCount.set(2);
    } else {
      this.visibleCount.set(3);
    }
  }

  visibleItems = computed(() => {
    const all = this.items;
    const start = this.startIndex();
    const count = this.visibleCount();
    return all.slice(start, start + count);
  });

  canGoPrev = computed(() => this.startIndex() > 0);

  canGoNext = computed(() => {
    return this.startIndex() < this.items.length - this.visibleCount();
  });

  prev() {
    if (this.canGoPrev()) {
      this.startIndex.update(v => v - 1);
    }
  }

  next() {
    if (this.canGoNext()) {
      this.startIndex.update(v => v + 1);
    }
  }

  goToService(service:any){
    this.router.navigate(['../services/', service.route], {
      relativeTo: this.route,
    });
  }
}
