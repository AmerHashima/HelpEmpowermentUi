import { Component, inject, input } from '@angular/core';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { FeatureComponent } from '../../../shared/clientSide/feature/feature.component';
import { GenericModelComponent } from '../../../shared/generic-model/generic-model.component';
import { NgClass } from '@angular/common';

interface Question {
  id: string;
  text: string;
  options: { letter: string; text: string; isSelected?: boolean }[];
  progress: number;        // 0–100
  questionNumber: number;
  totalQuestions: number;
}
type QuestionStatus = 'notVisited' | 'answered' | 'marked' | 'skipped';

@Component({
  selector: 'app-client-exam-question',
  imports: [SiteButtonComponent,TranslatePipe,FeatureComponent,
    GenericModelComponent,NgClass
  ],
  templateUrl: './client-exam-question.component.html',
  styleUrl: './client-exam-question.component.scss'
})
export class ClientExamQuestionComponent {
  private shared=inject(Shared);
  isRTL=this.shared.isRtl
  question = input.required<Question>();
  showConfirm:boolean=false;
  showQuestionBoard:boolean=false;
  questionboardNumbers: { number: number; status: QuestionStatus }[] =
    Array.from({ length: 180 }, (_, i) => ({
      number: i + 1,
      status: 'skipped'
    }));
  selectOption(opt: Question['options'][number]) {
    this.question().options.forEach(o => o.isSelected = false);
    opt.isSelected = true;
  }
  onOpenCalculator(){}
  onOpenWhiteboard(){}
  onSaveExamForLater(){}
  onEndExam(){
    this.showConfirm=true;
  }
  EndExam(){
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
  onMarkQuestion(){}
  nextQuestion(){}
  previousQuestion(){}
}
