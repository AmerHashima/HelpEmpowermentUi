// // src\app\components\ClientSide\certifications\choose-exam\choose-exam.component.ts
// import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
// import { TranslatePipe } from '@ngx-translate/core';
// import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Shared } from '../../../../shared/Services/shared/shared';
// import { StudentExamService } from '../../../../Services/student-exam.service';
// import { AuthService } from '../../../../Services/auth.service';
// import { isPlatformBrowser } from '@angular/common';
// import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
// import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
// import { StudentService } from '../../../../Services/student-service.service';
// import { APIExamSummary, ExamSummary } from '../../../../models/certification';
// import { LoadingService } from '../../../../shared/Services/Loading/loading.service';
// import { clearedExamStatusOid, examModeOid, practiceModeOid } from '../../../../data/lookUPS';

// @Component({
//   selector: 'app-choose-exam',
//   imports: [TranslatePipe, GenericModelComponent, SiteButtonComponent],
//   templateUrl: './choose-exam.component.html',
//   styleUrl: './choose-exam.component.scss'
// })
// export class ChooseExamComponent {
//   private platformId = inject(PLATFORM_ID);
//   private router = inject(Router);
//   private shared = inject(Shared);
//   isRTL = this.shared.isRtl;
//   private studentExamService = inject(StudentExamService);
//   private studentService = inject(StudentService);
//   isEnrolled = this.studentService.isExamSimulatorEnrolled;
//   private auth = inject(AuthService);
//   private toasting = inject(ToastingMessagesService);
//   private route = inject(ActivatedRoute);
//   private loading=inject(LoadingService);
//   showConfirm = false;
//   showClearLessonLearned = false;
//   showMustLogin=false;
//   examName = computed(() => this.shared.currentExam()?.examName);

//   previousExamMode = computed(() => {
//     const examId = this.shared.currentExamId();
//     const allReports = this.studentExamService.reports();

//   //   return allReports.some(
//   //     // r => r.coursesMasterExamOid === examId && r.startedAt && r.finishedAt
//   //     r => r.coursesMasterExamOid === examId && r.startedAt && r.finishedAt
//   //       && r.examModeLookupId == 'dddddddd-dddd-dddd-1212-dddddddddd02')
//   // });
//     return allReports.some(
//       // r => r.coursesMasterExamOid === examId && r.startedAt && r.finishedAt
//       r => r.coursesMasterExamOid === examId && r.startedAt && r.finishedAt
//         && r.examModeLookupId == examModeOid)
//   });
//   latestReport = this.studentExamService.latestReport;


//   // private getStorageKey(examId: string, mode: string) {
//   //   return `exam-progress-student_${this.auth.loggedStudent()?.userId}-${mode}-${examId}`;
//   // }




//   ngOnInit(): void {
//     const studentId = this.auth.loggedStudent()?.userId;
//     if (!studentId) return;
//     this.studentExamService.loadReports(studentId);
//     this.studentExamService.loadLatestReport();
//   }



//   private getStorageKey(examId: string, mode: string, free: boolean = false): string {
//     const userId = this.auth.loggedStudent()?.userId;
//     const hasToken = this.auth.studentToken();

//     const isFreeWithUser = free && hasToken;

//     const prefix = isFreeWithUser
//       ? `exam-progress-freeExam-${userId}`
//       : free
//         ? `exam-progress-freeExam`
//         : `exam-progress-student_${userId}`;

//     return `${prefix}-${mode}-${examId}`;
//   }

//   startExam(mode: 'Practice' | 'Exam') {
//     if (!isPlatformBrowser(this.platformId)) return;
//     const examId = this.shared.currentExamId();
//     const exam = this.shared.currentExam();
//     const freeExam = exam?.freeExam ?? false;
//     if(freeExam && !this.auth.loggedStudent()){
//       this.showMustLogin=true;
//       return;
//     }
//     if (this.shouldBlockExamStart(mode)) {
//       this.showClearLessonLearned = true;
//       return;
//     }

//     const storageKey = this.getStorageKey(examId, mode, freeExam);
//     const savedExam = localStorage.getItem(storageKey);

//     if (savedExam) {
//       this.handleResumeExam(savedExam, freeExam,mode);
//       return;
//     }

//     this.handleStartNewExam(mode, freeExam);
//   }

//   // private shouldBlockExamStart(mode: 'Practice' | 'Exam'): boolean {
//   //   return !!(
//   //     this.latestReport() &&
//   //     this.latestReport()?.examStatusLookupId !== '12516b05-9d35-4499-9122-9561dfb4a9ce' &&
//   //     mode === 'Exam' &&
//   //     this.auth.studentToken() &&
//   //     this.isEnrolled()
//   //   );
//   // }

//   private shouldBlockExamStart(mode: 'Practice' | 'Exam'): boolean {
//     const latestReport = this.latestReport();
//     const hasReport = !!latestReport;

//     // const statusCheck =
//     //   latestReport?.examStatusLookupId !== '12516b05-9d35-4499-9122-9561dfb4a9ce';
//     const statusCheck =
//       latestReport?.examStatusLookupId !== clearedExamStatusOid;


//     const isExamMode = mode === 'Exam';

//     const hasToken = !!this.auth.studentToken();

//     const enrolled = this.isEnrolled();

//     console.log('--- shouldBlockExamStart DEBUG ---');
//     console.log('latestReport exists:', latestReport);
//     console.log('latestReport exists:', hasReport);
//     console.log('examStatusLookupId:', latestReport?.examStatusLookupId);
//     console.log('statusCheck (not finished):', statusCheck);
//     console.log('mode === Exam:', isExamMode);
//     console.log('has token:', hasToken);
//     console.log('is enrolled:', enrolled);

//     const result =
//       hasReport &&
//       statusCheck &&
//       isExamMode &&
//       hasToken &&
//       enrolled;

//     console.log('FINAL RESULT:', result);
//     console.log('----------------------------------');

//     return result;
//   }

//   private handleResumeExam(savedExam: string, freeExam: boolean,mode:string) {

//     const parsed = JSON.parse(savedExam);

//     if (mode == 'Exam' && !freeExam) {
//       this.shared.studentExamId.set(parsed.studentExamId);
//       localStorage.setItem('studentExamId', parsed.studentExamId);
//     }

//     this.toasting.showToast('examToast.resume.success', 'success');
//     this.chooseMode(parsed.examMode || 'Practice');
//   }


//   private handleStartNewExam(mode: 'Practice' | 'Exam', freeExam: boolean) {

//     if (!freeExam && mode == 'Exam') {
//       this.loading.start();
//       this.studentExamService.startExam(this.getStartExamPayload(mode))
//         .subscribe({
//           next: (exam) => {
//             this.loading.stop();
//             this.shared.studentExamId.set(exam.oid);
//             localStorage.setItem('studentExamId', exam.oid);
//             this.chooseMode(mode);

//           },
//           error:(e)=>{
//             this.loading.stop();
//             this.toasting.showToast('examToast.startFailed','error');
//           }
//         });
//     }
//     else{
//       this.toasting.showToast('examToast.start','success');
//       this.chooseMode(mode);
//       return;
//     }

//   }

//   chooseMode(mode: 'Practice' | 'Exam') {
//     const freeExam=this.shared.currentExam()?.freeExam;
//     this.navigateToExam(mode, freeExam)
//   }


//   navigateToExam(mode: 'Practice' | 'Exam', freeExam: boolean = false) {

//     const baseRoute = !freeExam && mode == 'Exam' ? '../exams/': '../free-exam/' ;


//     this.router.navigate([baseRoute, this.shared.currentExamId()], {
//       relativeTo: this.route,
//       queryParams: { mode },
//       queryParamsHandling: 'merge',
//     });
//   }



//   getStartExamPayload(mode: string) {
//     const payload = {
//       studentOid: this.auth.loggedStudent()?.userId ?? null,
//       coursesMasterExamOid: this.shared.currentExamId(),
//       // examModeLookupId: mode === 'Exam' ? "dddddddd-dddd-dddd-1212-dddddddddd02" : "dddddddd-dddd-dddd-1212-dddddddddd01",
//       examModeLookupId: mode === 'Exam' ? examModeOid : practiceModeOid,
//       attemptNo: 0,
//       createdBy: this.auth.loggedStudent()?.userId ?? null
//     }
//     return payload;
//   }

//   // openReports() {
//   //   if ((this.previousExamMode() && this.isEnrolled()) )
//   //     this.router.navigate(['../reports'], {
//   //       relativeTo: this.route
//   //     });
//   //   else this.showConfirm = true;
//   // }

//   openReports() {
//     if ((this.previousExamMode() && this.isEnrolled()) || (this.shared.currentExam()?.freeExam && this.auth.studentToken()))
//       this.router.navigate(['../reports'], {
//         relativeTo: this.route
//       });
//     else this.showConfirm = true;
//   }

//   // openLessonLearnedQuestions() {
//   //   if (this.previousExamMode() && this.isEnrolled())
//   //     this.router.navigate(['../lesson-learned'], {
//   //       relativeTo: this.route
//   //     });
//   //   else this.showConfirm = true;
//   // }


//   openLessonLearnedQuestions() {
//     if ((this.previousExamMode() && this.isEnrolled()) || (this.shared.currentExam()?.freeExam && this.auth.studentToken()))
//       this.router.navigate(['../lesson-learned'], {
//         relativeTo: this.route
//       });
//     else this.showConfirm = true;
//   }

//   back() {
//     if (isPlatformBrowser(this.platformId)) {
//       localStorage.removeItem('currentExam');
//       localStorage.removeItem('currentExamId');
//     }

//     this.shared.currentExam.set(null);
//     this.shared.currentExamId.set('');

//     this.router.navigate(['../exam-simulator'], {
//       relativeTo: this.route
//     });
//   }
//   onCloseLessonLearnedModel() {
//     this.showClearLessonLearned = false
//   }

//   clearLessonLearned() {

//     const report = this.latestReport();

//     if (!report) return;

//     this.studentExamService.clearLessonLearnedQuestions(report).subscribe({
//       next: () => this.showClearLessonLearned = false
//     });

//   }
// }



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
import { clearedExamStatusOid, examModeOid, practiceModeOid } from '../../../../data/lookUPS';

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
  private loading = inject(LoadingService);
  showConfirm = false;
  showClearLessonLearned = false;
  showMustLogin = false;
  examName = computed(() => this.shared.currentExam()?.examName);
  previousExamMode = computed(() => {
    const examId = this.shared.currentExamId();
    const isFree = this.shared.currentExam()?.freeExam ?? false;

    // ✅ FREE EXAM
    if (isFree) {
      const userId = this.auth.loggedStudent()?.userId;
      if (!userId) return false;

      const key = this.shared.getExamResultsKey(userId);
      if (!key) return false;

      const data = localStorage.getItem(key);
      if (!data) return false;

      try {
        const results = JSON.parse(data);

        return results.some(
          (r: any) =>
            r.coursesMasterExamOid === examId &&
            r.attemptNo != null // means attempt exists
        );
      } catch {
        return false;
      }
    }

    // ✅ API EXAM (existing logic)
    const allReports = this.studentExamService.reports();

    return allReports.some(
      r =>
        r.coursesMasterExamOid === examId &&
        r.startedAt &&
        r.finishedAt &&
        r.examModeLookupId == examModeOid
    );
  });

  // previousExamMode = computed(() => {
  //   const examId = this.shared.currentExamId();
  //   const allReports = this.studentExamService.reports();

  //   //   return allReports.some(
  //   //     // r => r.coursesMasterExamOid === examId && r.startedAt && r.finishedAt
  //   //     r => r.coursesMasterExamOid === examId && r.startedAt && r.finishedAt
  //   //       && r.examModeLookupId == 'dddddddd-dddd-dddd-1212-dddddddddd02')
  //   // });
  //   return allReports.some(
  //     // r => r.coursesMasterExamOid === examId && r.startedAt && r.finishedAt
  //     r => r.coursesMasterExamOid === examId && r.startedAt && r.finishedAt
  //       && r.examModeLookupId == examModeOid)
  // });
  // latestReport = this.studentExamService.latestReport;
  latestReport = computed(() => {
    const isFree = this.shared.currentExam()?.freeExam ?? false;

    if (isFree) {
      return this.shared.getLatestFreeExamReport(
        this.auth.loggedStudent()?.userId ?? null,
      );
    }

    return this.studentExamService.latestReport();
  });

  // private getStorageKey(examId: string, mode: string) {
  //   return `exam-progress-student_${this.auth.loggedStudent()?.userId}-${mode}-${examId}`;
  // }




  ngOnInit(): void {
    const studentId = this.auth.loggedStudent()?.userId;
    if (!studentId) return;
    this.studentExamService.loadReports(studentId);
    this.studentExamService.loadLatestReport();
  }



  private getStorageKey(examId: string, mode: string, free: boolean = false): string {
    const userId = this.auth.loggedStudent()?.userId;
    const hasToken = this.auth.studentToken();

    const isFreeWithUser = free && hasToken;

    const prefix = isFreeWithUser
      ? `exam-progress-freeExam-${userId}`
      : free
        ? `exam-progress-freeExam`
        : `exam-progress-student_${userId}`;

    return `${prefix}-${mode}-${examId}`;
  }

  startExam(mode: 'Practice' | 'Exam') {
    if (!isPlatformBrowser(this.platformId)) return;
    const examId = this.shared.currentExamId();
    const exam = this.shared.currentExam();
    const freeExam = exam?.freeExam ?? false;
    if (freeExam && !this.auth.loggedStudent()) {
      this.showMustLogin = true;
      return;
    }
    if (this.shouldBlockExamStart(mode)) {
      this.showClearLessonLearned = true;
      return;
    }

    const storageKey = this.getStorageKey(examId, mode, freeExam);
    const savedExam = localStorage.getItem(storageKey);

    if (savedExam) {
      this.handleResumeExam(savedExam, freeExam, mode);
      return;
    }

    this.handleStartNewExam(mode, freeExam);
  }
  private shouldBlockExamStart(mode: 'Practice' | 'Exam'): boolean {
    const isExamMode = mode === 'Exam';
    const hasToken = !!this.auth.studentToken();
    const enrolled = this.isEnrolled();
    const isFree = this.shared.currentExam()?.freeExam ?? false;

    const latest = this.latestReport();

    if (!latest) return false;

    const isCleared = this.isExamCleared(latest);

    return (
      !isCleared &&
      isExamMode &&
      hasToken &&
      (isFree || enrolled)
    );

  }


  private isExamCleared(latest: any): boolean {
    if (!latest) return false;
    return latest.examStatusLookupId === clearedExamStatusOid;
  }
  // private shouldBlockExamStart(mode: 'Practice' | 'Exam'): boolean {
  //   const latestReport = this.latestReport();
  //   const hasReport = !!latestReport;

  //   // const statusCheck =
  //   //   latestReport?.examStatusLookupId !== '12516b05-9d35-4499-9122-9561dfb4a9ce';
  //   const statusCheck =
  //     latestReport?.examStatusLookupId !== clearedExamStatusOid;


  //   const isExamMode = mode === 'Exam';

  //   const hasToken = !!this.auth.studentToken();

  //   const enrolled = this.isEnrolled();

  //   console.log('--- shouldBlockExamStart DEBUG ---');
  //   console.log('latestReport exists:', latestReport);
  //   console.log('latestReport exists:', hasReport);
  //   console.log('examStatusLookupId:', latestReport?.examStatusLookupId);
  //   console.log('statusCheck (not finished):', statusCheck);
  //   console.log('mode === Exam:', isExamMode);
  //   console.log('has token:', hasToken);
  //   console.log('is enrolled:', enrolled);

  //   const result =
  //     hasReport &&
  //     statusCheck &&
  //     isExamMode &&
  //     hasToken &&
  //     enrolled;

  //   console.log('FINAL RESULT:', result);
  //   console.log('----------------------------------');

  //   return result;
  // }

  private handleResumeExam(savedExam: string, freeExam: boolean, mode: string) {

    const parsed = JSON.parse(savedExam);

    if (mode == 'Exam' && !freeExam) {
      this.shared.studentExamId.set(parsed.studentExamId);
      localStorage.setItem('studentExamId', parsed.studentExamId);
    }

    this.toasting.showToast('examToast.resume.success', 'success');
    this.chooseMode(parsed.examMode || 'Practice');
  }


  private handleStartNewExam(mode: 'Practice' | 'Exam', freeExam: boolean) {

    if (!freeExam && mode == 'Exam') {
      this.loading.start();
      this.studentExamService.startExam(this.getStartExamPayload(mode))
        .subscribe({
          next: (exam) => {
            this.loading.stop();
            this.shared.studentExamId.set(exam.oid);
            localStorage.setItem('studentExamId', exam.oid);
            this.chooseMode(mode);

          },
          error: (e) => {
            this.loading.stop();
            this.toasting.showToast('examToast.startFailed', 'error');
          }
        });
    }
    else {
      this.toasting.showToast('examToast.start', 'success');
      this.chooseMode(mode);
      return;
    }

  }

  chooseMode(mode: 'Practice' | 'Exam') {
    const freeExam = this.shared.currentExam()?.freeExam;
    this.navigateToExam(mode, freeExam)
  }


  navigateToExam(mode: 'Practice' | 'Exam', freeExam: boolean = false) {

    const baseRoute = !freeExam && mode == 'Exam' ? '../exams/' : '../free-exam/';


    this.router.navigate([baseRoute, this.shared.currentExamId()], {
      relativeTo: this.route,
      queryParams: { mode },
      queryParamsHandling: 'merge',
    });
  }



  getStartExamPayload(mode: string) {
    const payload = {
      studentOid: this.auth.loggedStudent()?.userId ?? null,
      coursesMasterExamOid: this.shared.currentExamId(),
      // examModeLookupId: mode === 'Exam' ? "dddddddd-dddd-dddd-1212-dddddddddd02" : "dddddddd-dddd-dddd-1212-dddddddddd01",
      examModeLookupId: mode === 'Exam' ? examModeOid : practiceModeOid,
      attemptNo: 0,
      createdBy: this.auth.loggedStudent()?.userId ?? null
    }
    return payload;
  }

  // openReports() {
  //   if ((this.previousExamMode() && this.isEnrolled()) )
  //     this.router.navigate(['../reports'], {
  //       relativeTo: this.route
  //     });
  //   else this.showConfirm = true;
  // }

  openReports() {
    if ((this.previousExamMode() && this.isEnrolled()) || (this.shared.currentExam()?.freeExam && this.previousExamMode() && this.auth.studentToken()))
      this.router.navigate(['../reports'], {
        relativeTo: this.route
      });
    else this.showConfirm = true;
  }

  // openLessonLearnedQuestions() {
  //   if (this.previousExamMode() && this.isEnrolled())
  //     this.router.navigate(['../lesson-learned'], {
  //       relativeTo: this.route
  //     });
  //   else this.showConfirm = true;
  // }


  openLessonLearnedQuestions() {
    if ((this.previousExamMode() && this.isEnrolled()) || (this.shared.currentExam()?.freeExam && this.previousExamMode() && this.auth.studentToken()))
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

  // clearLessonLearned() {

  //   const report = this.latestReport();

  //   if (!report) return;

  //   this.studentExamService.clearLessonLearnedQuestions(report).subscribe({
  //     next: () => this.showClearLessonLearned = false
  //   });

  // }

  clearLessonLearned() {
    const isFree = this.shared.currentExam()?.freeExam ?? false;

    // ✅ Free Exam
    if (isFree) {
      this.shared.clearFreeExamLesson(
        this.auth.loggedStudent()?.userId ?? null,
      );

      this.showClearLessonLearned = false;
      return;
    }

    // ✅ API Exam
    const report = this.studentExamService.latestReport();
    if (!report) return;

    this.studentExamService.clearLessonLearnedQuestions(report).subscribe({
      next: () => {
        this.showClearLessonLearned = false;
      }
    });
  }

}
