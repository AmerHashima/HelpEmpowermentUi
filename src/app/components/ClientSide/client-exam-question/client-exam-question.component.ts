// src\app\components\ClientSide\client-exam-question\client-exam-question.component.ts
import { Component, effect, Inject, inject, input, output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { FeatureComponent } from '../../../shared/clientSide/feature/feature.component';
import { GenericModelComponent } from '../../../shared/generic-model/generic-model.component';
import { isPlatformBrowser, Location } from '@angular/common';
import { CalculatorComponent } from '../../../shared/calculator/calculator.component';
import { WhiteboardComponent } from '../../../shared/whiteboard/whiteboard.component';
import { DragComponentComponent } from '../drag-component/drag-component.component';
import { APIAnswer } from '../../../models/certification';
import { ExamTimerComponent } from '../certifications/exam-timer/exam-timer.component';

@Component({
  selector: 'app-client-exam-question',
  imports: [SiteButtonComponent, TranslatePipe, FeatureComponent, ExamTimerComponent,
    GenericModelComponent, CalculatorComponent, WhiteboardComponent, DragComponentComponent
  ],
  templateUrl: './client-exam-question.component.html',
  styleUrl: './client-exam-question.component.scss'
})
export class ClientExamQuestionComponent {

  // next = output<void>();
  // revealAnswer = output<string>();
  next = output<any>();
  mode = input<string>('');
  answerLocked = input<boolean>(false);
  previous = output<void>();
  goToQuestion = output<number>();
  mark = output<boolean>();
  finishExam = output<boolean>();
  showBoard = output<boolean>();

  saveForLater = output<void>();
  private shared = inject(Shared);
  isRTL = this.shared.isRtl
  // question = input.required<Question>();
  question = input.required<any>();
  isMarked = input<boolean>(false);
  savedMiddle: any[] = [];
  showConfirm: boolean = false;
  // showQuestionBoard:boolean=false;
  showCalculator: boolean = false;
  showWhiteboard: boolean = false;
  examAnswers = [];
  showCorrectAnswerFlag: boolean = false;
  showTranslateFlag: boolean = false;

  constructor(
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // effect(() => {

    //   if (this.answerLocked()) {
    //     const q = this.question();
    //     q?.answers?.forEach((a: any) => a.isSelected = false);
    //   }

    // });
  }


  ngOnChanges(changes: SimpleChanges) {

    if (changes['question']) {
      this.hideAnswersAndTranslations();
    }
    if (changes['question'] && this.isMatchingQuestion) {

      const q = this.question();

      const left = q?.answers.filter((a: APIAnswer) => a.question_Ask) ?? [];
      const right = q?.answers.filter((a: APIAnswer) => !a.question_Ask) ?? [];

      // reset arrays
      this.middle = new Array(left.length).fill(null);
      this._rightItems = [...right];

      const saved = q.savedMatchingAnswers ?? [];
      if (saved.length > 0) {
        saved.forEach((pair: any, index: number) => {

          const match = right.find(
            (r: any) => r.oid === pair.answerSelectedAnswerOid
          );

          if (match) {

            this.middle[index] = match;

            // remove from right column
            this._rightItems = this._rightItems.filter(
              r => r.oid !== match.oid
            );

          }

        });
        this.savedMiddle = [...this.middle]
      }

      console.log('middle', this.middle);
    }

  }

  get isFirstQuestion(): boolean {
    const q = this.question();
    return !q || q.orderNo === 1;
  }

  get isLastQuestion(): boolean {
    const q = this.question();
    return !q || q.orderNo === q.totalQuestions;
  }

  selectOption(opt: any['answers'][number]) {
    if (this.answerLocked()) return;
    console.log('answerLocked', this.answerLocked());
    if (this.isMatchingQuestion) return;

    const question = this.question();
    const max = question.maxChoices;

    if (max === 1) {
      question.answers.forEach((o: any) => o.isSelected = false);
      opt.isSelected = true;
      return;
    }

    if (max === 0) {
      opt.isSelected = !opt.isSelected;
      return;
    }

    const selectedCount = question.answers.filter((o: any) => o.isSelected).length;

    if (opt.isSelected) {
      opt.isSelected = false;
    } else if (selectedCount < max) {
      opt.isSelected = true;
    }
  }
  onOpenCalculator() {
    this.showCalculator = true;
  }
  onOpenWhiteboard() {
    this.showWhiteboard = true;
  }
  onSaveExamForLater() {
    this.saveForLater.emit();
  }
  onEndExam() {
    this.showConfirm = true;
  }
  EndExam() {
    this.showConfirm = false;
    this.finishExam.emit(true);
    console.log('confirm end exam');
  }
  onCancalEndExam() {
    this.showConfirm = false;
  }
  onOpenQuestionBoard() {
    this.showBoard.emit(true)
  }

  onTranslate() {
    this.showTranslateFlag = true
  }
  hideTranslations() {
    this.showTranslateFlag = false
  }
  onMarkQuestion() {
    this.hideAnswersAndTranslations();
    this.mark.emit(true);
  }

  showAnswer() {
    this.showCorrectAnswerFlag = true;
    // const q = this.question();
    // if (q?.oid) {
    //   this.revealAnswer.emit(q.oid);
    // }

  }
  hideAnswer() {
    this.showCorrectAnswerFlag = false;

  }


  nextQuestion() {
    if (this.isLastQuestion) return;
    this.submitQuestionAnswer();
    // this.hideAnswersAndTranslations();

    // const q = this.question();

    // if (!q) return;

    // // Multiple Choice Question
    // if (q.questionTypeName === 'Multiple Choice Question') {
    //   const payload = this.mapToAnswerPayload(q);

    //   if (!payload?.selectedAnswerOids?.length) {
    //     this.next.emit({ type: 'empty' });
    //     return;
    //   }

    //   this.next.emit({
    //     type: 'Multiple Choice Question',
    //     answers: payload
    //   });
    // }
    // // Matching Question
    // else if (q.questionTypeName === 'Matching') {
    //   const payload = this.buildMatchingAnswers(this.left, this.middle);

    //   if (!payload?.length) {
    //     this.next.emit({ type: 'empty' });
    //     return;
    //   }

    //   this.next.emit({
    //     type: 'Matching',
    //     answers: payload
    //   });
    // }
  }

  submitQuestionAnswer(last:boolean=false){
    this.hideAnswersAndTranslations();

    const q = this.question();

    if (!q) return;

    // Multiple Choice Question
    if (q.questionTypeName === 'Multiple Choice Question') {
      const payload = this.mapToAnswerPayload(q);

      if (!payload?.selectedAnswerOids?.length) {
        this.next.emit({ type: 'empty', last });
        return;
      }

      this.next.emit({
        type: 'Multiple Choice Question',
        answers: payload,
        last
      });
    }
    // Matching Question
    else if (q.questionTypeName === 'Matching') {
      const payload = this.buildMatchingAnswers(this.left, this.middle);

      if (!payload?.length) {
        this.next.emit({ type: 'empty', last });
        return;
      }

      this.next.emit({
        type: 'Matching',
        answers: payload,last
      });
    }
  }

  submit(){
    this.submitQuestionAnswer(true);
  }
  mapToAnswerPayload(question: any) {
    return {
      questionOid: question.oid,
      selectedAnswerOids: question.answers
        .filter((a: any) => a.isSelected)
        .map((a: any) => a.oid)
    };
  }

  previousQuestion() {
    if (this.isFirstQuestion) return;
    this.hideAnswersAndTranslations();
    this.previous.emit();
  }



  private hideAnswersAndTranslations() {
    this.showCorrectAnswerFlag = false;
    this.showTranslateFlag = false;
  }
  get isMatchingQuestion(): boolean {
    return this.question()?.questionTypeName.toLowerCase() === 'matching';
  }

  get left(): APIAnswer[] {
    if (!this.isMatchingQuestion) return [];
    return this.question()?.answers.filter((answer: APIAnswer) => answer.question_Ask) ?? [];
  }

  get correctMiddle(): APIAnswer[] {
    if (!this.isMatchingQuestion) return [];

    const answers = this.question()?.answers ?? [];

    return this.left
      .map((q) =>
        answers.find(
          (a: APIAnswer) =>
            !a.question_Ask && a.oid === q.correctAnswerOid
        )
      )
      .filter((a): a is APIAnswer => !!a);
  }

  private _rightItems: APIAnswer[] = [];

  get right(): APIAnswer[] {
    if (!this.isMatchingQuestion) return [];
    return this._rightItems;
  }
  set right(value: APIAnswer[]) {
    this._rightItems = value;
  }

  middle: APIAnswer[] = [];

  onMiddleChange(updated: APIAnswer[] | null) {
    if (updated)
      this.middle = updated;
  }

  buildMatchingAnswers(left: APIAnswer[], middle: APIAnswer[]) {
    const answers = left.map((l, index) => ({
      selectedAnswerOid: l.oid,
      answerSelectedAnswerOid: middle[index]?.oid ?? null
    }));

    return answers;
  }

  getExamTitle() {
    const exam = this.shared.currentExam();
    if (exam && this.mode())
      return `${exam.examName} - ${this.mode()} mode`
    else return '';
  }

  back() {
    if (isPlatformBrowser(this.platformId)) {
      this.location.back();
    }
  }

  onTimeUp() {
    console.log('Time up → auto next question');
    this.nextQuestion();
  }
}
