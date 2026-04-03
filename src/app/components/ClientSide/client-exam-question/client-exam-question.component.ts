import { Component, effect, Inject, inject, input, output, PLATFORM_ID, signal, SimpleChanges } from '@angular/core';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { FeatureComponent } from '../../../shared/clientSide/feature/feature.component';
import { GenericModelComponent } from '../../../shared/generic-model/generic-model.component';
import { isPlatformBrowser, Location, NgFor } from '@angular/common';
import { CalculatorComponent } from '../../../shared/calculator/calculator.component';
import { WhiteboardComponent } from '../../../shared/whiteboard/whiteboard.component';
import { DragComponentComponent } from '../drag-component/drag-component.component';
import { APIAnswer } from '../../../models/certification';
import { ExamTimerComponent } from '../certifications/exam-timer/exam-timer.component';
import { ExamProtectionService } from '../../../Services/exam-protection.service';
import { ToastingMessagesService } from '../../../shared/Services/ToastingMessages/toasting-messages.service';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-client-exam-question',
  imports: [SiteButtonComponent, TranslatePipe, FeatureComponent, ExamTimerComponent,
    GenericModelComponent, CalculatorComponent, WhiteboardComponent, DragComponentComponent,NgFor
  ],
  templateUrl: './client-exam-question.component.html',
  styleUrl: './client-exam-question.component.scss',
  providers: [ExamProtectionService]
})
export class ClientExamQuestionComponent {

  // next = output<void>();
  // revealAnswer = output<string>();
  watermarkText = signal<string>('Help Empowerment');
  next = output<any>();
  mode = input<string>('');
  // answerLocked = input<boolean>(false);
  previous = output<void>();
  goToQuestion = output<number>();
  mark = output<boolean>();
  finishExam = output<boolean>();
  forceEnd = output<boolean>();
  showBoard = output<boolean>();

  saveForLater = output<void>();
  private shared = inject(Shared);
  // private auth=inject(AuthService);
  isRTL = signal<string>('ltr');
  question = input.required<any>();
  isMarked = input<boolean>(false);
  savedMiddle: any[] = [];
  showConfirm: boolean = false;
  showCalculator: boolean = false;
  showWhiteboard: boolean = false;
  examAnswers = [];
  showCorrectAnswerFlag: boolean = false;
  showTranslateFlag: boolean = false;

  private protection = inject(ExamProtectionService);
  private toast = inject(ToastingMessagesService);


  // UI state
  isBlurred = signal(false);
  violationsCount = signal(0);

  showResultState = signal(false);
  ngOnInit() {
    // if(this.auth.studentToken()){
    //   this.watermarkText.set(`Help Empowerment - ${this.auth.loggedStudent()?.userId} - ${new Date().toISOString()}`);
    // }
   if(this.mode()== 'Exam'){
     this.protection.init(
       (type) => {
         this.isBlurred.set(true);

         const messages: any = {
           TAB_SWITCH: 'Do not leave the exam!',
           FAST_SWITCH: 'Suspicious behavior detected!',
           FULLSCREEN_EXIT: 'Stay in fullscreen!',
           DEVTOOLS: 'DevTools detected!',
           IDLE: 'You are inactive!',
           KEYBOARD: 'Keyboard shortcuts not allowed!',
           PRINT: 'Printing is not allowed!',
           SCREENSHOT: 'Screenshots are not allowed!'
         };

         this.showWarning(messages[type]);

         setTimeout(() => {
           this.isBlurred.set(false);
         }, 2000);
       },
       () => {
         this.forceSubmitExam();
       }
     );

     this.protection.enterFullscreen();
   }
    else this.protection.enterFullscreen();
  }



  showWarning(message:string) {
    this.toast.showToast(message, 'warning');
  }

  forceSubmitExam() {
    this.toast.showToast('Exam ended due to suspicious activity', 'error');
    this.forceEnd.emit(true);
  }
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
      this.showResultState.set(false);
      this.hideAnswersAndTranslations();

    }
    if (changes['question'] && this.isMatchingQuestion) {

      const q = this.question();

      const left = q?.answers.filter((a: APIAnswer) => a.question_Ask) ?? [];
      const right = q?.answers.filter((a: APIAnswer) => !a.question_Ask) ?? [];

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

            this._rightItems = this._rightItems.filter(
              r => r.oid !== match.oid
            );

          }

        });
        this.savedMiddle = [...this.middle]
      }
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
    // if (this.answerLocked()) return;
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
  }

  submitQuestionAnswer(last: boolean = false) {
    this.hideAnswersAndTranslations();
      this.showResultState.set(false);

    const q = this.question();

    if (!q) return;

    // Multiple Choice Question
    if (q.questionTypeName === 'Multiple Choice Question') {
      const payload = this.mapToAnswerPayload(q);

      if (!payload?.selectedAnswerOids?.length) {
        this.next.emit({ type: 'empty', last });
        return;
      }


      if (this.mode() !== 'Exam') {
        this.showResultState.set(true);
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


      if (this.mode() !== 'Exam') {
        this.showResultState.set(true);
      }
      this.next.emit({
        type: 'Matching',
        answers: payload, last
      });
    }


  }

  submit() {
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

    const allNull = middle.every(v => v === null);
    if (allNull) {
      return [];
    }
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
    if (this.isLastQuestion) {
      this.submitQuestionAnswer(true);
      return;
    }

    // normal flow
    this.nextQuestion();
  }

  get correctAnswersCount(): number {
    return this.question()?.answers?.filter((a: any) => a.isCorrect).length || 0;
  }

  get selectedCorrectCount(): number {
    return this.question()?.answers?.filter((a: any) => a.isSelected && a.isCorrect).length || 0;
  }

  get hasAnyCorrectSelected(): boolean {
    return this.selectedCorrectCount > 0;
  }

  get isMultipleCorrect(): boolean {
    return this.correctAnswersCount > 1;
  }

  isWrong(opt: any): boolean {
    return (
      this.mode() !== 'Exam' &&
      (
        (this.showResultState() || this.showCorrectAnswerFlag) &&
        opt.isSelected &&
        !opt.isCorrect
      )
    );
  }

  isCorrect(opt: any): boolean {
    if (this.mode() === 'Exam') return false;

    if (this.showCorrectAnswerFlag) {
      return opt.isCorrect;
    }

    if (this.showResultState()) {

      if (!this.isMultipleCorrect) {
        return opt.isSelected && opt.isCorrect;
      }

      if (this.isMultipleCorrect) {
        return this.hasAnyCorrectSelected && opt.isCorrect;
      }
    }

    return false;
  }

  ngOnDestroy() {
    if(this.mode() == 'Exam'){
      this.protection.destroy();
    }
  }
}
