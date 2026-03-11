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
      title: "PMO Setup & Operation",
      description:
        "Service involves establishing a Project Management Office (PMO) within the organization",
      route: "pmo",

    },
    {
      icon: "bi bi-clipboard-data",
      title: "Project Management Maturity Assessment",
      description: "Benchmark Your Capabilities. Chart Your Growth.",
      route: "maturity-assessment",

    },
    {
      icon: "bi bi-mortarboard",
      title: "Customized Training",
      description: "Tailored Excellence: Build Your Own Training Solution",
      route: "training",

    },
    {
      icon: "bi bi-people",
      title: "Manpower (Post Your Vacancy)",
      description:
        "We empower your business with our network of exceptional professionals.",
      route: "manpower",

    },
    {
      icon: "bi bi-bar-chart",
      title: "Project Management Information System (PMIS)",
      description: "Empower Your Decisions with Smarter Data Insights",
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