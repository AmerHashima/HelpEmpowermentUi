import { isPlatformBrowser, Location } from '@angular/common';
import { Component, computed, inject, Inject,  output, PLATFORM_ID, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { StudentExamService } from '../../../Services/student-exam.service';
import { Shared } from '../../../shared/Services/shared/shared';
import { APIExamSummary, ExamSummary } from '../../../models/certification';
import { AuthService } from '../../../Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-exam-lesson-learned-questions',
  imports: [TranslatePipe],
  templateUrl: './exam-lesson-learned-questions.component.html',
  styleUrl: './exam-lesson-learned-questions.component.scss'
})
export class ExamLessonLearnedQuestionsComponent {
  private studentExamService=inject(StudentExamService);
  private auth = inject(AuthService);
  private shared=inject(Shared);
  private router=inject(Router);
  private route=inject(ActivatedRoute);
  latestReport = signal<APIExamSummary|null>(null);
  statusStats = computed(() => {
    const summary = this.latestReport()?.statusSummary ?? [];

    const get = (name: string) =>
      summary.find(s => s.statusName === name) ?? { count: 0, percentage: 0 };

    return {
      correct: get('Correct'),
      incorrect: get('Incorrect'),
      notAnswered: get('Not Answered')
    };
  });
  total = computed(() => this.latestReport()?.totalQuestions ?? 0);

  // practice = output<{ type: string }>();

  lessonCleared = signal(false);
  constructor(
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    const payload: ExamSummary ={
      studentId: this.auth.loggedStudent()?.userId!,
      examId: this.shared.currentExamId()
    }
    console.log(payload);
    this.studentExamService.getExamSummary(payload).subscribe({
      next: (report) => {
        this.latestReport.set(report);
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

  // ngOnInit(): void {

  //   if (this.isLessonCleared()) {
  //     this.latestReport.set(null);
  //     this.lessonCleared.set(true);
  //     return;
  //   }

  //   const payload: ExamSummary = {
  //     studentId: this.auth.loggedStudent()?.userId!,
  //     examId: this.shared.currentExamId()
  //   };

  //   this.studentExamService.getExamSummary(payload).subscribe({
  //     next: report => this.latestReport.set(report),
  //     error: err => console.log(err)
  //   });

  // }

  // isLessonCleared(): boolean {

  //   if (!isPlatformBrowser(this.platformId)) return false;

  //   const stored = localStorage.getItem('lessonLearnedStatus');
  //   if (!stored) return false;

  //   const data = JSON.parse(stored);

  //   return (
  //     data.cleared &&
  //     data.studentId === this.auth.loggedStudent()?.userId &&
  //     data.examId === this.shared.currentExamId()
  //   );
  // }
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
    this.lessonCleared.set(true);
  }
  startNewExam(){
      if (isPlatformBrowser(this.platformId)) {
        this.location.back();
      }
}
}
