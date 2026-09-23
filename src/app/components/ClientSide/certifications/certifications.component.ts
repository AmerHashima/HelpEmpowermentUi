// src\app\components\ClientSide\certifications\certifications.component.ts
import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { GenericTabsComponent } from '../../../shared/generic-tabs/generic-tabs.component';
import { Shared } from '../../../shared/Services/shared/shared';
import { Subscription } from 'rxjs/internal/Subscription';
import { catchError, distinctUntilChanged, filter, of, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CertificationsStore } from '../../../AdminPanelStores/CertificationStore/certification.store';
import { CertificationService } from '../../../Services/certification.service';
import { LOOKUP_CODES, LookupService } from '../../../Services/lookup.service';
import { LookupDetail } from '../../../models/lookup';
import { CourseTabContentService } from '../../../Services/course-tab-content.service';
import { CourseTabKey } from '../../../models/course-tab-content';
import { CourseCustomSectionsComponent } from './course-custom-sections/course-custom-sections.component';
@Component({
  selector: 'app-certifications',
  imports: [RouterOutlet, GenericTabsComponent, CourseCustomSectionsComponent],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
  providers: [CertificationsStore]
})
export class CertificationsComponent {

  private shared = inject(Shared);
  private certificationsStore = inject(CertificationsStore);
  private lookupService=inject(LookupService);
  private router = inject(Router);
  private tabContentService = inject(CourseTabContentService);
  lang = this.shared.lang;
  isFullPage = this.shared.fullPage;
  currentCertification = this.shared.currentCertificate;
  private configuredTabs = toSignal(
    toObservable(this.currentCertification).pipe(
      distinctUntilChanged(),
      switchMap(code => code ? this.tabContentService.getCourse(code).pipe(catchError(() => of([]))) : of([]))
    ), { initialValue: [] }
  );
  tabs = computed(() => {
    const definitions: { header: string; icon: string; route: string; key: CourseTabKey }[] = [
    {
      key: 'exam-simulator',
      header: 'tabs.examSimulator',
      icon: 'bi bi-journal-check',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/exam-simulator`
    },
    {
      key: 'recorded-course',
      header: 'tabs.recordedCourse',
      icon: 'bi bi-play-btn',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/recorded-course`
    },
    {
      key: 'live-course',
      header: 'tabs.liveCourse',
      icon: 'bi bi-camera-video',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/live-course`
    },
    {
      key: 'webinar',
      header: 'tabs.webinar',
      icon: 'bi bi-people',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/webinar`
    },
    {
      key: 'quiz-game',
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
      key: 'faq',
      header: 'tabs.faqs',
      icon: 'bi bi-question-circle',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/faq`
    },
    {
      key: 'reviews',
      header: 'tabs.reviews',
      icon: 'bi bi-star',
      route: `/${this.lang()}/certifications/${this.currentCertification()}/reviews`
    }];
    const configured = this.configuredTabs();
    if (!configured.length) return definitions;
    return definitions
      .filter(tab => configured.find(item => item.tabKey === tab.key)?.isEnabled !== false)
      .sort((a, b) =>
        (configured.find(item => item.tabKey === a.key)?.orderNo ?? 99) -
        (configured.find(item => item.tabKey === b.key)?.orderNo ?? 99));
  });
  readonly activeTabKey = signal<CourseTabKey | null>(null);
  readonly activeSections = computed(() => {
    const key = this.activeTabKey();
    return this.configuredTabs().find(tab => tab.tabKey === key)?.content.sections ?? [];
  });


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
    const tabKeys: CourseTabKey[] = ['exam-simulator', 'recorded-course', 'live-course', 'webinar', 'quiz-game', 'faq', 'reviews'];
    this.activeTabKey.set(tabKeys.includes(this.lastSegment as CourseTabKey) ? this.lastSegment as CourseTabKey : null);

    this.showTabs = !['reports', 'lesson-learned', 'chooseExam']
      .includes(this.lastSegment);

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
