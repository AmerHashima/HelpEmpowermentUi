
import { Injectable, RendererFactory2, Renderer2, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { certifications } from '../../clientSide/certification-cards/certification-cards.component';
import { Router } from '@angular/router';
import { courseExam } from '../../../models/certification';
import { LessonReportVM } from '../../../components/ClientSide/exam-lesson-learned-questions/exam-lesson-learned-questions.component';
import { clearedExamStatusOid } from '../../../data/lookUPS';

@Injectable({
  providedIn: 'root'
})
export class Shared {
  private router = inject(Router);
  // Signals
  isCollapse = signal(false);
  page = signal('Home');
  lang = signal<'en' | 'ar'>('en');
  isRtl = computed(() => this.lang() === 'ar');
  currentCertificate = signal('');
  certifications = signal<any>(null);
  currentCertificationObject = computed(() => {
    const certName = this.currentCertificate();
    const certs = this.certifications();
    if (!certName || !certs?.length) return null;
    const certification = certs.find((c: any) => c.courseName.toLowerCase() === certName) ?? null;
    return certification;
  });
  currentVideoOid = signal<string>('');
  currentExamId = signal('');
  currentExam = signal<courseExam | null>(null);
  studentExamId = signal('');
  fullPage = signal<boolean>(false);

  theme = signal<string>('light');


  private freeExamRefresh = signal(0);

  // 👇 expose readonly
  freeExamRefresh$ = this.freeExamRefresh.asReadonly();

  triggerFreeExamRefresh() {
    this.freeExamRefresh.update(v => v + 1);
  }

  // Dependencies
  private platformId = inject(PLATFORM_ID);
  private translate = inject(TranslateService);
  private rendererFactory = inject(RendererFactory2);

  // Renderer — created safely
  private renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);

  constructor() {
    this.initLanguage();
    if (isPlatformBrowser(this.platformId)) {
      this.restoreExamIdFromStorage();
    }
  }

  private restoreExamIdFromStorage() {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentUrl = this.router.url;
    const savedExamId = localStorage.getItem('currentExamId');
    const savedExam = localStorage.getItem('currentExam');
    const savedstudettExamId = localStorage.getItem('studentExamId');
    console.log('savedstudettExamId', savedstudettExamId);
    if (savedstudettExamId) {
      this.studentExamId.set(savedstudettExamId);
    }

    if (
      savedExamId &&
      (currentUrl.includes('/chooseExam') || currentUrl.includes('/lesson-learned') || currentUrl.includes('/reports') || currentUrl.includes('?mode'))
    ) {
      this.currentExamId.set(savedExamId);
    }
    if (
      savedExam &&
      (currentUrl.includes('/chooseExam') || currentUrl.includes('/lesson-learned') || currentUrl.includes('/reports') || currentUrl.includes('?mode'))
    ) {
      this.currentExam.set(JSON.parse(savedExam));
    }
  }

  private initLanguage() {
    if (!isPlatformBrowser(this.platformId)) {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      return;
    }

    const savedLang = localStorage.getItem('preferredLang');
    const browserLang = this.translate.getBrowserLang() || 'en';
    const initialLang = ['en', 'ar'].includes(savedLang!) ? savedLang : browserLang;

    this.useLanguage(initialLang as 'en' | 'ar');
  }

  useLanguage(lang: 'en' | 'ar') {
    if (!isPlatformBrowser(this.platformId)) return;

    this.translate.use(lang);

    this.lang.set(lang);

    localStorage.setItem('preferredLang', lang);

    this.updateDirectionAndStylesheets(lang);
  }

  /**
   * Updates document direction and toggles Bootstrap LTR/RTL stylesheets
   */
  private updateDirectionAndStylesheets(lang: 'en' | 'ar') {
    const isArabic = lang === 'ar';

    this.renderer.setAttribute(document.documentElement, 'dir', isArabic ? 'rtl' : 'ltr');

    // Toggle Bootstrap stylesheets
    const ltrLink = document.querySelector<HTMLLinkElement>('link[id="bootstrap-ltr"]');
    const rtlLink = document.querySelector<HTMLLinkElement>('link[id="bootstrap-rtl"]');

    if (ltrLink && rtlLink) {
      this.renderer.setProperty(ltrLink, 'disabled', isArabic);
      this.renderer.setProperty(rtlLink, 'disabled', !isArabic);
    }
  }


  setIsCollapsed() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.innerWidth < 768) {
      this.isCollapse.set(true);
    }
  }


  getScoreCategory(score: number, totalScore: number): string {
    const percentage = (score / totalScore) * 100;

    if (percentage >= 83) {
      return 'aboveTarget';
    } else if (percentage >= 65) {
      return 'target';
    } else if (percentage >= 54) {
      return 'belowTarget';
    } else {
      return 'improvement';
    }
  }

  getScoreLabel(score: number, totalScore: number): string {
    const percentage = (score / totalScore) * 100;

    if (percentage >= 83) {
      return 'Above Target';
    } else if (percentage >= 65) {
      return 'Target';
    } else if (percentage >= 54) {
      return 'Below Target';
    } else {
      return 'Needs Improvement';
    }
  }

  // getLatestFreeExamResult(userId: string | null): any | null {
  //   if (!userId) return null;
  //   const examId=this.currentExamId()
  //   const key = this.getExamResultsKey(userId);
  //   if (!key) return null;

  //   const data = localStorage.getItem(key);
  //   if (!data) return null;

  //   try {
  //     const results = JSON.parse(data);

  //     const attempts = results
  //       .filter((r: any) => r.coursesMasterExamOid === examId)
  //       .sort((a: any, b: any) => (b.attemptNo ?? 0) - (a.attemptNo ?? 0));

  //     return attempts[0] ?? null;
  //   } catch {
  //     return null;
  //   }
  // }


  getLatestFreeExamReport(userId: string | null): LessonReportVM | null {
    // const userId = this.auth.loggedStudent()?.userId;
    if (!userId) return null;

    const key = this.getExamResultsKey(userId);
    if (!key) return null;
    const data = localStorage.getItem(key);
    if (!data) return null;

    try {
      const results = JSON.parse(data);
      const examId = this.currentExamId();

      const attempts = results
        .filter((r: any) => r.coursesMasterExamOid === examId)
        .sort((a: any, b: any) => (b.attemptNo ?? 0) - (a.attemptNo ?? 0));

      const last = attempts[0];
      if (!last) return null;

      return {
        totalQuestions: last.totalScore,
        totalScore: last.totalScore,
        obtainedScore: last.obtainedScore,
        studentExamOid: null,
        examStatusLookupId: last.cleared ? clearedExamStatusOid : null,
        questionAnswersOids: last.questionAnswersOids,
        statusSummary: [
          {
            statusName: 'Correct',
            count: last.obtainedScore ?? 0,
            percentage: this.calcPercent(last.obtainedScore, last.totalScore)
          },
          {
            statusName: 'Incorrect',
            count: last.summary.incorrect ?? 0,
            percentage: this.calcPercent(last.summary.incorrect, last.totalScore)
          },
          {
            statusName: 'Not Answered',
            count: last.summary.notAnswered ?? 0,
            percentage: this.calcPercent(last.summary.notAnswered, last.totalScore)
          }
        ]
      };
    } catch {
      return null;
    }
  }

  private calcPercent(value: number, total: number): number {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  }
  getExamResultsKey(userId: string | null): string | null {
    if (!userId) return null;

    return `exam-results-freeExam-certification--${this.currentCertificate()}-user-${userId}`;
  }

  clearFreeExamLesson(userId: string | null) {
    if (!userId) return;
    const examId = this.currentExamId();
    const key = this.getExamResultsKey(userId);
    if (!key) return;

    const data = localStorage.getItem(key);
    if (!data) return;

    try {
      let results: any[] = JSON.parse(data);

      const attempts = results
        .filter(r => r.coursesMasterExamOid === examId)
        .sort((a, b) => (b.attemptNo ?? 0) - (a.attemptNo ?? 0));

      if (!attempts.length) return;

      const latest = attempts[0];

      results = results.map(r => {
        if (
          r.coursesMasterExamOid === examId &&
          r.attemptNo === latest.attemptNo
        ) {
          return {
            ...r,
            cleared: true,
            clearedAt: new Date().toISOString()
          };
        }
        return r;
      });

      localStorage.setItem(key, JSON.stringify(results));

      // ✅ notify all components
      this.triggerFreeExamRefresh();

    } catch (e) {
      console.error('Error clearing free exam lesson:', e);
    }
  }
}
