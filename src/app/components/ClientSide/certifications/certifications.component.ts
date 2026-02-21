// src\app\components\ClientSide\certifications\certifications.component.ts
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { GenericTabsComponent } from '../../../shared/generic-tabs/generic-tabs.component';
import { Shared } from '../../../shared/Services/shared/shared';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs';
import { certifications } from '../../../shared/clientSide/certification-cards/certification-cards.component';

@Component({
  selector: 'app-certifications',
  imports: [RouterOutlet, GenericTabsComponent],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
})
export class CertificationsComponent {
  private shared = inject(Shared);
  private router = inject(Router);
  lang = this.shared.lang;
  isFullPage = this.shared.fullPage;
  currentCertification = this.shared.currentCertificate;
  tabs = computed(() => [
    {
      header: 'Exam Simulator',
      icon: 'bi bi-journal-check',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/exam-simulator`
    },
    {
      header: 'Recorded Course',
      icon: 'bi bi-play-btn',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/recorded-course`
    },
    {
      header: 'Live Course',
      icon: 'bi bi-camera-video',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/live-course`
    },
    {
      header: 'Webinar',
      icon: 'bi bi-people',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/webinar`
    },
    {
      header: 'Quiz Game',
      icon: 'bi bi-controller',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/quiz-game`
    },
    {
      header: 'Articles',
      icon: 'bi bi-file-text',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/articles`
    },
    {
      header: 'FAQS',
      icon: 'bi bi-question-circle',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/faq`
    },
    {
      header: 'Reviews',
      icon: 'bi bi-star',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/reviews`
    }
  ]);

  private route = inject(ActivatedRoute);

  showTabs: boolean = true;
  lastSegment = '';
  private sub!: Subscription;


  constructor() {
    // Subscribe to navigation events
    this.sub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url.split('?')[0].split('#')[0];
        const segments = url.split('/').filter(s => s.length > 0);
        this.lastSegment = segments[segments.length - 1];

        // Hide tabs for certain routes
        this.showTabs = !['reports', 'lesson-learned', 'chooseExam'].includes(this.lastSegment);
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
