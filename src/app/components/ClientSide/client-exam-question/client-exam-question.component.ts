import { Component, inject, input } from '@angular/core';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { FeatureComponent } from '../../../shared/clientSide/feature/feature.component';
import { GenericModelComponent } from '../../../shared/generic-model/generic-model.component';
import { NgClass } from '@angular/common';
import { CalculatorComponent } from '../../../shared/calculator/calculator.component';
import { WhiteboardComponent } from '../../../shared/whiteboard/whiteboard.component';

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
    GenericModelComponent,NgClass,CalculatorComponent,WhiteboardComponent
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
  showCalculator:boolean=false;
  showWhiteboard:boolean=false;
  questionboardNumbers: { number: number; status: QuestionStatus }[] =
    Array.from({ length: 180 }, (_, i) => ({
      number: i + 1,
      status: 'skipped'
    }));


  selectOption(opt: Question['options'][number]) {
    this.question().options.forEach(o => o.isSelected = false);
    opt.isSelected = true;
  }
  navigateToQuestion(question:any){
    this.showQuestionBoard=false;
    this.question=question;
  }
  onOpenCalculator(){
    this.showCalculator=true;
    // const width = 380;
    // const height = 520;
    // const left = (screen.width - width) / 2;
    // const top = (screen.height - height) / 2;



    // // const popup = window.open(
    // //   'https://www.theonlinecalculator.com/',
    // //   'calcPopup',
    // //   `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no,toolbar=no,location=no,menubar=no`
    // // );

    // // if (!popup) {
    // //   alert('Popup was blocked! Please allow popups for this site.');
    // // }

    // const calculatorWindow = window.open(
    //   '/calculator',
    //   'myCalculator',
    //   `width=${width},height=${height},left=${left},top=${top},` +
    //   'resizable=yes,scrollbars=no,toolbar=no,location=no,menubar=no'
    // );

    // // Very useful feedback
    // if (!calculatorWindow || calculatorWindow.closed || typeof calculatorWindow.closed === 'undefined') {
    //   alert('Popup blocked!\nPlease allow popups for this website');
    // }
  }
  onOpenWhiteboard(){
    this.showWhiteboard=true;
  }
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
