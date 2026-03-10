import { isPlatformBrowser, Location } from '@angular/common';
import { Component, computed, inject, Inject, input, output, PLATFORM_ID, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { StudentExamService } from '../../../Services/student-exam.service';
import { Shared } from '../../../shared/Services/shared/shared';

@Component({
  selector: 'app-exam-lesson-learned-questions',
  imports: [TranslatePipe],
  templateUrl: './exam-lesson-learned-questions.component.html',
  styleUrl: './exam-lesson-learned-questions.component.scss'
})
export class ExamLessonLearnedQuestionsComponent {
  private studentExamService=inject(StudentExamService);
  private shared=inject(Shared);
  latestReport = computed(() => {
    const examId = this.shared.currentExamId();

    const reports = this.studentExamService
      .reports()
      .filter(r => r.coursesMasterExamOid === examId && r.startedAt);

    if (!reports.length) return null;

    return reports.reduce((a, b) =>
      new Date(b.startedAt!).getTime() > new Date(a.startedAt!).getTime() ? b : a
    );
  });

  correct = input<number>(100);
  incorrect = input<number>(60);
  notAnswered = input<number>(20);
  total = input<number>(180);

  practice = output<{ type: string }>();

  lessonCleared = signal(false);
  constructor(
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  donutStyle() {
    const report = this.latestReport();

    if (!report || !report.totalScore) return '';

    const total = report.totalScore;

    const correct = (report.obtainedScore / total) * 100;
    const wrong = (this.incorrect() / total) * 100;
    const na = (this.notAnswered() / total) * 100;

    const wrongEnd = wrong;
    const correctEnd = wrong + correct;

    return `conic-gradient(
    #e53935 0% ${wrongEnd}%,
    #43a047 ${wrongEnd}% ${correctEnd}%,
    #607d8b ${correctEnd}% 100%
  )`;
  }
  correctPercent() {
    const report = this.latestReport();

    if (!report || !report.totalScore) return 0;

    const correct = report.obtainedScore;
    const total = report.totalScore;

    return Math.round((correct / total) * 100);
  }

  wrongPercent() {
    const report = this.latestReport();

    if (!report || !report.totalScore) return 0;
    const total = report.totalScore;

    return Math.round((this.incorrect() / total) * 100);
  }

  naPercent() {
    const report = this.latestReport();

    if (!report || !report.totalScore) return 0;
    const total = report.totalScore;
    return Math.round((this.notAnswered() / total) * 100);
  }
  practiceQuestions(type: string) {
    this.practice.emit({ type });
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
