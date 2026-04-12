// import { isPlatformBrowser, Location } from '@angular/common';
// import { Component, computed, inject, Inject, output, PLATFORM_ID, signal } from '@angular/core';
// import { TranslatePipe } from '@ngx-translate/core';
// import { StudentExamService } from '../../../Services/student-exam.service';
// import { Shared } from '../../../shared/Services/shared/shared';
// import { APIExamSummary, ExamSummary } from '../../../models/certification';
// import { AuthService } from '../../../Services/auth.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { clearedExamStatusOid } from '../../../data/lookUPS';


// @Component({
//   selector: 'app-exam-lesson-learned-questions',
//   imports: [TranslatePipe],
//   templateUrl: './exam-lesson-learned-questions.component.html',
//   styleUrl: './exam-lesson-learned-questions.component.scss'
// })
// export class ExamLessonLearnedQuestionsComponent {
//   private studentExamService = inject(StudentExamService);
//   private auth = inject(AuthService);
//   private shared = inject(Shared);
//   private router = inject(Router);
//   private route = inject(ActivatedRoute);
//   // latestReport = signal<APIExamSummary | null>(null);
//   latestReport = this.studentExamService.latestReport;
//   statusStats = computed(() => {
//     const summary = this.latestReport()?.statusSummary ?? [];

//     const get = (name: string) =>
//       summary.find(s => s.statusName === name) ?? { count: 0, percentage: 0 };

//     return {
//       correct: get('Correct'),
//       incorrect: get('Incorrect'),
//       notAnswered: get('Not Answered')
//     };
//   });
//   total = computed(() => this.latestReport()?.totalQuestions ?? 0);

//   lessonCleared = computed(() => !this.latestReport() || this.latestReport()?.examStatusLookupId == clearedExamStatusOid);

//   // lessonCleared = signal(false);
//   constructor(
//     private location: Location,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) { }




//   donutStyle() {
//     const report = this.latestReport();

//     if (!report || !report.totalScore) return '';

//     const total = report.totalScore;

//     const correct = this.statusStats().correct.percentage;
//     const wrong = this.statusStats().incorrect.percentage;
//     const na = this.statusStats().notAnswered.percentage;

//     const wrongEnd = wrong;
//     const correctEnd = wrong + correct;

//     return `conic-gradient(
//     #e53935 0% ${wrongEnd}%,
//     #43a047 ${wrongEnd}% ${correctEnd}%,
//     #607d8b ${correctEnd}% 100%
//   )`;
//   }

//   practiceQuestions(type: string) {
//     // this.practice.emit({ type });

//     this.router.navigate(['./practice'], {
//       relativeTo: this.route,
//       queryParams: { type: type, examId: this.latestReport()?.studentExamOid },
//       queryParamsHandling: 'merge',
//     });
//   }

//   clearLesson() {
//     const report = this.latestReport();

//     if (!report) return;

//     this.studentExamService.clearLessonLearnedQuestions(report).subscribe({});
//   }

//   startNewExam() {
//     if (isPlatformBrowser(this.platformId)) {
//       this.location.back();
//     }
//   }

// }



import { isPlatformBrowser, Location } from '@angular/common';
import { Component, computed, effect, inject, Inject, output, PLATFORM_ID, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { StudentExamService } from '../../../Services/student-exam.service';
import { Shared } from '../../../shared/Services/shared/shared';
import { APIExamSummary, ExamSummary } from '../../../models/certification';
import { AuthService } from '../../../Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { clearedExamStatusOid } from '../../../data/lookUPS';

export interface LessonReportVM {
  totalQuestions: number;
  totalScore: number;
  obtainedScore: number;
  studentExamOid: string | null;
  examStatusLookupId: string | null;

  statusSummary: {
    statusName: string;
    count: number;
    percentage: number;
  }[];
}

type StatusItem = {
  statusName: string;
  count: number;
  percentage: number;
};

@Component({
  selector: 'app-exam-lesson-learned-questions',
  imports: [TranslatePipe],
  templateUrl: './exam-lesson-learned-questions.component.html',
  styleUrl: './exam-lesson-learned-questions.component.scss'
})
export class ExamLessonLearnedQuestionsComponent {
  private studentExamService = inject(StudentExamService);
  private auth = inject(AuthService);
  private shared = inject(Shared);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  isFreeExam = computed(() => this.shared.currentExam()?.freeExam);
  // latestReport = this.studentExamService.latestReport;

  latestReport = computed<LessonReportVM | null>(() => {
    this.shared.freeExamRefresh$();
    if (this.isFreeExam()) {
      return this.shared.getLatestFreeExamReport(this.auth.loggedStudent()?.userId ?? null);
    }

    const api = this.studentExamService.latestReport();
    if (!api) return null;

    return {
      totalQuestions: api.totalQuestions ?? 0,
      totalScore: api.totalScore ?? 0,
      obtainedScore: api.obtainedScore ?? 0,
      studentExamOid: api.studentExamOid,
      examStatusLookupId: api.examStatusLookupId,
      statusSummary: api.statusSummary ?? []
    };
  });

  // statusStats = computed(() => {
  //   const summary = this.latestReport()?.statusSummary ?? [];

  //   const get = (name: string) =>
  //     summary.find(s => s.statusName === name) ?? { count: 0, percentage: 0 };

  //   return {
  //     correct: get('Correct'),
  //     incorrect: get('Incorrect'),
  //     notAnswered: get('Not Answered')
  //   };
  // });
  statusStats = computed(() => {
    const summary: StatusItem[] = this.latestReport()?.statusSummary ?? [];

    const get = (name: string): StatusItem =>
      summary.find((s: StatusItem) => s.statusName === name) ?? {
        statusName: name,
        count: 0,
        percentage: 0
      };

    return {
      correct: get('Correct'),
      incorrect: get('Incorrect'),
      notAnswered: get('Not Answered')
    };
  });

  total = computed(() => this.latestReport()?.totalQuestions ?? 0);

  // lessonCleared = computed(() => !this.latestReport() || this.latestReport()?.examStatusLookupId == clearedExamStatusOid);
  lessonCleared = computed(() => {
    const report = this.latestReport();
    if (!report) return true;

    return report.examStatusLookupId === clearedExamStatusOid;
  });
  // lessonCleared = signal(false);
  constructor(
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    effect(() => console.log('lessonCleared', this.lessonCleared()))
  }




  donutStyle() {
    const report = this.latestReport();

    if (!report || !report.totalScore) return '';

    const total = report.totalScore;

    const correct = this.statusStats().correct.percentage;
    const wrong = this.statusStats().incorrect.percentage;
    const na = this.statusStats().notAnswered.percentage;

    const wrongEnd = wrong;
    const correctEnd = wrong + correct;

    return `conic-gradient(
    #e53935 0% ${wrongEnd}%,
    #43a047 ${wrongEnd}% ${correctEnd}%,
    #607d8b ${correctEnd}% 100%
  )`;
  }

  practiceQuestions(type: string) {
    // this.practice.emit({ type });

    this.router.navigate(['./practice'], {
      relativeTo: this.route,
      queryParams: { type: type, examId: this.latestReport()?.studentExamOid },
      queryParamsHandling: 'merge',
    });
  }


  clearLesson() {
    if (this.isFreeExam()) {
      this.shared.clearFreeExamLesson(this.auth.loggedStudent()?.userId ?? null);
      return;
    }

    const report = this.studentExamService.latestReport();
    if (!report) return;

    this.studentExamService.clearLessonLearnedQuestions(report).subscribe({});
  }

  // clearLesson() {
  //   const report = this.latestReport();

  //   if (!report) return;

  //   this.studentExamService.clearLessonLearnedQuestions(report).subscribe({});
  // }

  startNewExam() {
    if (isPlatformBrowser(this.platformId)) {
      this.location.back();
    }
  }



  // private getLatestFreeExamReport(): LessonReportVM | null {
  //   const userId = this.auth.loggedStudent()?.userId;
  //   if (!userId) return null;

  //   const key = this.shared.getExamResultsKey(userId);
  //   if(!key) return null;
  //   const data = localStorage.getItem(key);
  //   if (!data) return null;

  //   try {
  //     const results = JSON.parse(data);
  //     const examId = this.shared.currentExamId();

  //     const attempts = results
  //       .filter((r:any) => r.coursesMasterExamOid === examId)
  //       .sort((a:any, b:any) => (b.attemptNo ?? 0) - (a.attemptNo ?? 0));

  //     const last = attempts[0];
  //     if (!last) return null;

  //     return {
  //       totalQuestions: last.totalScore,
  //       totalScore: last.totalScore,
  //       obtainedScore: last.obtainedScore,
  //       studentExamOid: null,
  //       examStatusLookupId: last.cleared ? clearedExamStatusOid : null,
  //       statusSummary: [
  //         {
  //           statusName: 'Correct',
  //           count: last.obtainedScore ?? 0,
  //           percentage: this.calcPercent(last.obtainedScore, last.totalScore)
  //         },
  //         {
  //           statusName: 'Incorrect',
  //           count: last.summary.incorrect ?? 0,
  //           percentage: this.calcPercent(last.summary.incorrect, last.totalScore)
  //         },
  //         {
  //           statusName: 'Not Answered',
  //           count: last.summary.notAnswered ?? 0,
  //           percentage: this.calcPercent(last.summary.notAnswered, last.totalScore)
  //         }
  //       ]
  //     };
  //   } catch {
  //     return null;
  //   }
  // }

  // private calcPercent(value: number, total: number): number {
  //   if (!total) return 0;
  //   return Math.round((value / total) * 100);
  // }
}
