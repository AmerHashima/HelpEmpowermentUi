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
import { APIAnswer } from '../../../models/certification';


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

  // next = output<void>();
  next = output<any>();
  previous = output<void>();
  goToQuestion = output<number>();
  mark = output<boolean>();
  finishExam = output<boolean>();


  private shared=inject(Shared);
  isRTL=this.shared.isRtl
  // question = input.required<Question>();
  question = input.required<any>();
  savedMiddle:any[]=[];
  showConfirm:boolean=false;
  showQuestionBoard:boolean=false;
  showCalculator:boolean=false;
  showWhiteboard:boolean=false;
  examAnswers=[];
  questionboardNumbers: { number: number; status: QuestionStatus }[] =
    Array.from({ length: 180 }, (_, i) => ({
      number: i + 1,
      status: 'skipped'
    }));

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['question'] && this.isMatchingQuestion) {
  //     this._rightItems = this.question()?.answers.filter((a: any) => !a.question_Ask) ?? [];
  //   }
  // }
  ngOnChanges(changes: SimpleChanges) {

    if (changes['question'] && this.isMatchingQuestion) {

      const q = this.question();

      const left = q?.answers.filter((a: APIAnswer) => a.question_Ask) ?? [];
      const right = q?.answers.filter((a: APIAnswer) => !a.question_Ask) ?? [];

      // reset arrays
      this.middle = new Array(left.length).fill(null);
      this._rightItems = [...right];

      const saved = q.savedMatchingAnswers ?? [];
      if(saved.length > 0){
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

    console.log('middle' , this.middle);    }

  }
  // selectOption(opt: Question['options'][number]) {
  selectOption(opt: any['answers'][number]) {
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
    console.log(this.question().questionTypeName);
    if (this.question().questionTypeName == 'Multiple Choice Question'){
      this.next.emit({
        type:"Multiple Choice Question",
        answers: this.mapToAnswerPayload(this.question())
      })
    }
      else if (this.question().questionTypeName == 'Matching'){
      this.next.emit({type:'Matching',
        answers:this.buildMatchingAnswers(this.left,this.middle)
      });

    }
    // console.log('before next',this.question())
    // this.next.emit();
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
    this.previous.emit();
  }

  navigateToQuestion(q: { number: number }) {
    this.goToQuestion.emit(q.number);
     this.showQuestionBoard=false;
  }


  get isMatchingQuestion(): boolean {
    return this.question()?.questionTypeName.toLowerCase() === 'matching';
  }

  get left(): APIAnswer[] {
    if (!this.isMatchingQuestion) return [];
    return this.question()?.answers.filter((answer: APIAnswer) => answer.question_Ask) ?? [];
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
    if(updated)
       this.middle=updated;
    console.log('Middle updated:', updated);
  }

  buildMatchingAnswers(left: APIAnswer[], middle: APIAnswer[]) {
    const answers = left.map((l, index) => ({
      selectedAnswerOid: l.oid,
      answerSelectedAnswerOid: middle[index]?.oid ?? null
    }));

    return answers;
  }


}
