import { isPlatformBrowser, Location } from '@angular/common';
import { Component, Inject, input, output, PLATFORM_ID, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-exam-lesson-learned-questions',
  imports: [TranslatePipe],
  templateUrl: './exam-lesson-learned-questions.component.html',
  styleUrl: './exam-lesson-learned-questions.component.scss'
})
export class ExamLessonLearnedQuestionsComponent {

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
    const total = this.total();

    if (!total) return '';

    const correct = (this.correct() / total) * 100;
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
    return Math.round((this.correct() / this.total()) * 100);
  }

  wrongPercent() {
    return Math.round((this.incorrect() / this.total()) * 100);
  }

  naPercent() {
    return Math.round((this.notAnswered() / this.total()) * 100);
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
