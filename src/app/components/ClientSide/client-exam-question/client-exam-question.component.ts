import { Component, inject, input, output, SimpleChanges } from '@angular/core';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { FeatureComponent } from '../../../shared/clientSide/feature/feature.component';
import { GenericModelComponent } from '../../../shared/generic-model/generic-model.component';
import { NgClass } from '@angular/common';
import { CalculatorComponent } from '../../../shared/calculator/calculator.component';
import { WhiteboardComponent } from '../../../shared/whiteboard/whiteboard.component';
import { DragComponentComponent } from '../drag-component/drag-component.component';
import { AnyAaaaRecord } from 'node:dns';

// interface Question {
//   id: string;
//   text: string;
//   type:string;
//   options: { letter: string; text: string; isSelected?: boolean }[];
//   progress: number;
//   questionNumber: number;
//   totalQuestions: number;
//   maxChoices: number;
// }
type QuestionStatus = 'notVisited' | 'answered' | 'marked' | 'skipped';

@Component({
  selector: 'app-client-exam-question',
  imports: [SiteButtonComponent,TranslatePipe,FeatureComponent,
    GenericModelComponent,NgClass,CalculatorComponent,WhiteboardComponent,DragComponentComponent
  ],
  templateUrl: './client-exam-question.component.html',
  styleUrl: './client-exam-question.component.scss'
})
export class ClientExamQuestionComponent {

  next = output<void>();
  previous = output<void>();
  goToQuestion = output<number>();
  mark = output<boolean>();
  finishExam = output<boolean>();


  private shared=inject(Shared);
  isRTL=this.shared.isRtl
  // question = input.required<Question>();
  question = input.required<any>();

  showConfirm:boolean=false;
  showQuestionBoard:boolean=false;
  showCalculator:boolean=false;
  showWhiteboard:boolean=false;
  questionboardNumbers: { number: number; status: QuestionStatus }[] =
    Array.from({ length: 180 }, (_, i) => ({
      number: i + 1,
      status: 'skipped'
    }));

  ngOnChanges(changes: SimpleChanges) {
    if (changes['question'] && this.isMatchingQuestion) {
      this._rightItems = this.question()?.answers.filter((a: any) => !a.question_Ask) ?? [];
    }
  }
  // selectOption(opt: Question['options'][number]) {
  selectOption(opt: any['answers'][number]) {
    if (this.isMatchingQuestion) return;

    const question = this.question();
    console.log(question.answers);
    console.log(question.maxChoices);
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
  // selectOption(opt: any['options'][number]) {

  //   const question = this.question();
  //   const max = question.maxChoices;

  //   // If single choice → behave like radio button
  //   if (max === 1) {
  //     question.options.forEach((o:any) => o.isSelected = false);
  //     opt.isSelected = true;
  //     return;
  //   }

  //   // If unlimited choices
  //   if (max === 0) {
  //     opt.isSelected = !opt.isSelected;
  //     return;
  //   }

  //   // If limited multiple choice
  //   const selectedCount = question.options.filter((o:any) => o.isSelected).length;

  //   if (opt.isSelected) {
  //     // Allow deselect
  //     opt.isSelected = false;
  //   } else {
  //     // Only select if under limit
  //     if (selectedCount < max) {
  //       opt.isSelected = true;
  //     }
  //   }
  // }
  // navigateToQuestion(question:any){
  //   this.showQuestionBoard=false;
  //   this.question=question;
  // }
  onOpenCalculator(){
    this.showCalculator=true;
  }
  onOpenWhiteboard(){
    this.showWhiteboard=true;
  }
  onSaveExamForLater(){}
  onEndExam(){
    this.showConfirm=true;
  }
  EndExam(){
    this.finishExam.emit(true);
    console.log('confirm end exam');
  }
  onCancalEndExam(){
    this.showConfirm=false;
  }
  onOpenQuestionBoard(){
    this.showQuestionBoard=true
  }
  closeQuestionBoard(){
  this.showQuestionBoard = false;
  }
  onTranslate(){}
  onMarkQuestion() {
    // Toggle for now – later you can track real marked questions
    this.mark.emit(true); // or toggle logic
  }

  nextQuestion() {
    console.log('before next',this.question())
    this.next.emit();
  }

  previousQuestion() {
    this.previous.emit();
  }

  navigateToQuestion(q: { number: number }) {
    this.goToQuestion.emit(q.number);
     this.showQuestionBoard=false;
  }


  get isMatchingQuestion(): boolean {
    return this.question()?.questionTypeName.toLowerCase() === 'matching';
  }

  get left(): AnyAaaaRecord[] {
    if (!this.isMatchingQuestion) return [];
    return this.question()?.answers.filter((answer:any) => answer.question_Ask) ?? [];
  }

  private _rightItems: any[] = [];

  // get right(): any[] {
  //   if (!this.isMatchingQuestion) return [];
  //   return this._rightItems.length ? this._rightItems : this.question()?.answers.filter((answer: any) => !answer.question_Ask) ?? [];
  // }
  get right(): any[] {
    if (!this.isMatchingQuestion) return [];
    // Always return _rightItems, even if empty
    return this._rightItems;
  }
  set right(value: any[]) {
    this._rightItems = value;
  }

  middle: string[] = [];

  onMiddleChange(updated: string[]) {
    console.log('Middle updated:', updated);
  }

}
