// src\app\components\ClientSide\certifications\choose-exam\choose-exam.component.ts
import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from '../../../../shared/Services/shared/shared';
import { StudentExamService } from '../../../../Services/student-exam.service';
import { AuthService } from '../../../../Services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { StudentService } from '../../../../Services/student-service.service';
import { APIExamSummary, ExamSummary } from '../../../../models/certification';
import { LoadingService } from '../../../../shared/Services/Loading/loading.service';

@Component({
  selector: 'app-choose-exam',
  imports: [TranslatePipe, GenericModelComponent, SiteButtonComponent],
  templateUrl: './choose-exam.component.html',
  styleUrl: './choose-exam.component.scss'
})
export class ChooseExamComponent {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;
  private studentExamService = inject(StudentExamService);
  private studentService = inject(StudentService);
  isEnrolled = this.studentService.isExamSimulatorEnrolled;
  private auth = inject(AuthService);
  private toasting = inject(ToastingMessagesService);
  private route = inject(ActivatedRoute);
  private loading=inject(LoadingService);
  showConfirm = false;
  showClearLessonLearned = false;
  examName = computed(() => this.shared.currentExam()?.examName);

  previousExamMode = computed(() => {
    const examId = this.shared.currentExamId();
    const allReports = this.studentExamService.reports();

    return allReports.some(
      // r => r.coursesMasterExamOid === examId && r.startedAt && r.finishedAt
      r => r.coursesMasterExamOid === examId && r.startedAt && r.finishedAt
        && r.examModeLookupId == 'dddddddd-dddd-dddd-1212-dddddddddd02')
  });
  latestReport = this.studentExamService.latestReport;


  // private getStorageKey(examId: string, mode: string) {
  //   return `exam-progress-student_${this.auth.loggedStudent()?.userId}-${mode}-${examId}`;
  // }




  ngOnInit(): void {
    this.studentExamService.loadLatestReport();
  }


  private getStorageKey(examId: string, mode: string, free: boolean = false) {
    if (!free)
      return `exam-progress-student_${this.auth.loggedStudent()?.userId}-${mode}-${examId}`;
    else return `exam-progress-freeExam-${mode}-${examId}`;

  }

  startExam(mode: 'Practice' | 'Exam') {

    if (!isPlatformBrowser(this.platformId)) return;

    const examId = this.shared.currentExamId();
    const exam = this.shared.currentExam();
    const freeExam = exam?.freeExam ?? false;

    // 🔥 1. Guard: Non-cleared exam
    if (this.shouldBlockExamStart(mode)) {
      this.showClearLessonLearned = true;
      return;
    }

    const storageKey = this.getStorageKey(examId, mode, freeExam);
    const savedExam = localStorage.getItem(storageKey);

    // 🔥 2. Resume existing exam
    if (savedExam) {
      this.handleResumeExam(savedExam, freeExam);
      return;
    }

    // 🔥 3. Start new exam
    this.handleStartNewExam(mode, freeExam);
  }

  private shouldBlockExamStart(mode: 'Practice' | 'Exam'): boolean {
    return !!(
      this.latestReport() &&
      this.latestReport()?.examStatusLookupId !== '12516b05-9d35-4499-9122-9561dfb4a9ce' &&
      mode === 'Exam' &&
      this.auth.studentToken() &&
      this.isEnrolled()
    );
  }

  private handleResumeExam(savedExam: string, freeExam: boolean) {

    const parsed = JSON.parse(savedExam);

    if (!freeExam) {
      this.shared.studentExamId.set(parsed.studentExamId);
      localStorage.setItem('studentExamId', parsed.studentExamId);
    }

    this.toasting.showToast('examToast.resume.success', 'success');
    this.chooseMode(parsed.examMode || 'Practice');
  }


  private handleStartNewExam(mode: 'Practice' | 'Exam', freeExam: boolean) {

    if (freeExam) {
      this.chooseMode(mode);
      return;
    }
    this.loading.start();
    this.studentExamService.startExam(this.getStartExamPayload(mode))
      .subscribe({
        next: (exam) => {
          this.loading.stop();
          this.shared.studentExamId.set(exam.oid);
          localStorage.setItem('studentExamId', exam.oid);
          this.chooseMode(mode);
        }
      });
  }

  // startExam(mode: 'Practice' | 'Exam') {
  //   // if (this.latestReport() && mode == 'Exam' && this.auth.studentToken()) {
  //   console.log('latest rep[prt', this.latestReport());
  //   console.log('mode', mode);
  //   console.log(' this.auth.studentToken()', this.auth.studentToken());
  //   console.log('this.isEnrolled()', 'this.isEnrolled()');

  //   //non cleared exam check
  //   if (this.latestReport() && this.latestReport()?.examStatusLookupId != '12516b05-9d35-4499-9122-9561dfb4a9ce'
  //     && mode == 'Exam' && this.auth.studentToken() && this.isEnrolled()) {
  //     console.log('showClearLessonLearned', this.showClearLessonLearned);
  //     this.showClearLessonLearned = true;
  //     return;
  //   }

  //   const examId = this.shared.currentExamId();
  //   const exam = this.shared.currentExam();
  //   const freeExam = exam?.freeExam

  //   if (!isPlatformBrowser(this.platformId)) return;

  //   const storageKey = this.getStorageKey(examId, mode, freeExam);
  //   const savedExam = localStorage.getItem(storageKey);

  //   if (savedExam) {
  //     const parsed = JSON.parse(savedExam);

  //     if (!freeExam) {
  //       this.shared.studentExamId.set(parsed.studentExamId);
  //       localStorage.setItem('studentExamId', parsed.studentExamId);
  //     }
  //     this.toasting.showToast('examToast.resume.success', 'success');
  //     this.chooseMode(mode)
  //   }
  //   else {
  //     if(!freeExam){
  //       this.studentExamService.startExam(this.getStartExamPayload(mode))
  //         .subscribe({
  //           next: (exam) => {
  //             console.log('in start');
  //             this.shared.studentExamId.set(exam.oid);
  //             localStorage.setItem('studentExamId', exam.oid);
  //             this.chooseMode(mode)
  //           }
  //         });
  //     } else this.chooseMode(mode)

  //   }

  // }

  // startExam(mode: string) {
  //   // if (this.latestReport() && mode == 'Exam' && this.auth.studentToken()) {
  //   console.log('latest rep[prt',this.latestReport());
  //   console.log('mode', mode);
  //   console.log(' this.auth.studentToken()', this.auth.studentToken());
  //   console.log('this.isEnrolled()','this.isEnrolled()');

  //   if (this.latestReport()  && this.latestReport()?.examStatusLookupId != '12516b05-9d35-4499-9122-9561dfb4a9ce'
  //    && mode == 'Exam' && this.auth.studentToken() && this.isEnrolled()) {
  //     console.log('showClearLessonLearned', this.showClearLessonLearned);
  //     this.showClearLessonLearned = true;
  //     return;
  //   }

  //   const examId = this.shared.currentExamId();
  //   const exam = this.shared.currentExam();
  //   console.log('exam',exam);
  //   console.log('startExam in Start Exam Function',exam);

  //   if (!isPlatformBrowser(this.platformId)) return;

  //   const storageKey = this.getStorageKey(examId, mode);
  //   const savedExam = localStorage.getItem(storageKey);

  //   if (savedExam) {
  //     const parsed = JSON.parse(savedExam);

  //     this.shared.studentExamId.set(parsed.studentExamId);
  //     localStorage.setItem('studentExamId', parsed.studentExamId);

  //     this.toasting.showToast('examToast.resume.success', 'success');
  //     this.chooseMode(mode)

  //   }
  //   else {
  //     this.studentExamService.startExam(this.getStartExamPayload(mode))
  //       .subscribe({
  //         next: (exam) => {
  //           console.log('in start');
  //           this.shared.studentExamId.set(exam.oid);
  //           localStorage.setItem('studentExamId', exam.oid);
  //           this.chooseMode(mode)
  //         }
  //       });
  //   }

  // }

  // chooseMode(mode: string) {
  //   if (mode === 'Practice') {
  //     this.onChoosePracticeMode();
  //   }
  //   else if (mode === 'Exam') {
  //     this.onChooseExamMode();
  //   }
  // }

  chooseMode(mode: 'Practice' | 'Exam') {
    const freeExam=this.shared.currentExam()?.freeExam;
    this.navigateToExam(mode, freeExam)
  }


  navigateToExam(mode: 'Practice' | 'Exam', freeExam: boolean = false) {
    console.log(`in ${mode.toLowerCase()} mode`);

    const baseRoute = freeExam ? '../free-exam/' : '../exams/';

    this.router.navigate([baseRoute, this.shared.currentExamId()], {
      relativeTo: this.route,
      queryParams: { mode },
      queryParamsHandling: 'merge',
    });
  }

  // onStartFreeExam() {
  //   // this.router.navigate(['../exams/', this.shared.currentExamId()], {
  //   //   relativeTo: this.route,
  //   //   queryParams: { mode: 'exam' },
  //   //   queryParamsHandling: 'merge',
  //   // });

  //   console.log('start free exam');
  // }

  getStartExamPayload(mode: string) {
    const payload = {
      studentOid: this.auth.loggedStudent()?.userId ?? null,
      coursesMasterExamOid: this.shared.currentExamId(),
      examModeLookupId: mode === 'Exam' ? "dddddddd-dddd-dddd-1212-dddddddddd02" : "dddddddd-dddd-dddd-1212-dddddddddd01",
      attemptNo: 0,
      createdBy: this.auth.loggedStudent()?.userId ?? null
    }
    console.log('payload', payload);
    return payload;
  }
  // getStartExamPayload(mode:string) {
  //   const payload = {
  //     studentOid: this.auth.loggedStudent()?.userId!,
  //     coursesMasterExamOid: this.shared.currentExamId(),
  //     examModeLookupId: mode === 'Exam' ? "dddddddd-dddd-dddd-1212-dddddddddd02" :"dddddddd-dddd-dddd-1212-dddddddddd01",
  //     attemptNo: 0,
  //     createdBy: this.auth.loggedStudent()?.userId!
  //   }
  //   console.log('payload', payload);
  //   return payload;
  // }
  openReports() {

    if (this.previousExamMode() && this.isEnrolled())
      this.router.navigate(['../reports'], {
        relativeTo: this.route
      });
    else this.showConfirm = true;
  }

  openLessonLearnedQuestions() {
    // if (this.previousExamMode())
    if (this.previousExamMode() && this.isEnrolled())
      this.router.navigate(['../lesson-learned'], {
        relativeTo: this.route
      });
    else this.showConfirm = true;
  }

  back() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentExam');
      localStorage.removeItem('currentExamId');
    }

    this.shared.currentExam.set(null);
    this.shared.currentExamId.set('');

    this.router.navigate(['../exam-simulator'], {
      relativeTo: this.route
    });
  }
  onCloseLessonLearnedModel() {
    this.showClearLessonLearned = false
  }

  clearLessonLearned() {

    const report = this.latestReport();

    if (!report) return;

    this.studentExamService.clearLessonLearnedQuestions(report).subscribe({
      next: () => this.showClearLessonLearned = false
    });

  }
}
