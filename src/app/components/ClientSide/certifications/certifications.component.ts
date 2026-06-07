// src\app\components\ClientSide\certifications\certifications.component.ts
import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { GenericTabsComponent } from '../../../shared/generic-tabs/generic-tabs.component';
import { Shared } from '../../../shared/Services/shared/shared';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs';
import { CertificationsStore } from '../../../AdminPanelStores/CertificationStore/certification.store';
import { CertificationService } from '../../../Services/certification.service';
import { LOOKUP_CODES, LookupService } from '../../../Services/lookup.service';
import { LookupDetail } from '../../../models/lookup';
@Component({
  selector: 'app-certifications',
  imports: [RouterOutlet, GenericTabsComponent],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
  providers: [CertificationsStore]
})
export class CertificationsComponent {

  private shared = inject(Shared);
  private certificationsStore = inject(CertificationsStore);
  private lookupService=inject(LookupService);
  private router = inject(Router);
  lang = this.shared.lang;
  isFullPage = this.shared.fullPage;
  currentCertification = this.shared.currentCertificate;
  tabs = computed(() => [
    {
      header: 'tabs.examSimulator',
      icon: 'bi bi-journal-check',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/exam-simulator`
    },
    {
      header: 'tabs.recordedCourse',
      icon: 'bi bi-play-btn',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/recorded-course`
    },
    {
      header: 'tabs.liveCourse',
      icon: 'bi bi-camera-video',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/live-course`
    },
    {
      header: 'tabs.webinar',
      icon: 'bi bi-people',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/webinar`
    },
    {
      header: 'tabs.quizGame',
      icon: 'bi bi-controller',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/quiz-game`
    },
    // {
    //   header: 'tabs.articles',
    //   icon: 'bi bi-file-text',
    //   route: `/${this.lang()}/certifications/${this.currentCertification()}/articles`
    // },
    {
      header: 'tabs.faqs',
      icon: 'bi bi-question-circle',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/faq`
    },
    {
      header: 'tabs.reviews',
      icon: 'bi bi-star',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/reviews`
    }
  ]);


  showTabs: boolean = true;
  lastSegment = '';
  private sub!: Subscription;

  constructor() {

    effect(() => {
      this.certificationsStore.setSelectedCertification(
        this.shared.currentCertificationObject()
      );
    });

    this.updateTabsVisibility();

    this.sub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateTabsVisibility();
      });
  }
  // constructor() {
  //   effect(()=>{
  //     this.certificationsStore.setSelectedCertification(this.shared.currentCertificationObject());
  //   });

  //   this.sub = this.router.events
  //     .pipe(filter(event => event instanceof NavigationEnd))
  //     .subscribe(() => {
  //       const url = this.router.url.split('?')[0].split('#')[0];
  //       const segments = url.split('/').filter(s => s.length > 0);
  //       this.lastSegment = segments[segments.length - 1];

  //       // Hide tabs for certain routes
  //       this.showTabs = !['reports', 'lesson-learned', 'chooseExam'].includes(this.lastSegment);
  //     });
  // }

  private updateTabsVisibility() {

    const url = this.router.url.split('?')[0].split('#')[0];
    const segments = url.split('/').filter(s => s.length > 0);

    this.lastSegment = segments[segments.length - 1];

    this.showTabs = !['reports', 'lesson-learned', 'chooseExam']
      .includes(this.lastSegment);

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
