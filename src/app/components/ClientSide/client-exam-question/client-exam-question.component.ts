import { Component, inject, input } from '@angular/core';
import { SiteButtonComponent } from '../../../shared/clientSide/site-button/site-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { FeatureComponent } from '../../../shared/clientSide/feature/feature.component';

interface Question {
  id: string;
  text: string;
  options: { letter: string; text: string; isSelected?: boolean }[];
  progress: number;        // 0–100
  questionNumber: number;
  totalQuestions: number;
}

@Component({
  selector: 'app-client-exam-question',
  imports: [SiteButtonComponent,TranslatePipe,FeatureComponent],
  templateUrl: './client-exam-question.component.html',
  styleUrl: './client-exam-question.component.scss'
})
export class ClientExamQuestionComponent {
  private shared=inject(Shared);
  isRTL=this.shared.isRtl
  question = input.required<Question>();

  selectOption(opt: Question['options'][number]) {
    this.question().options.forEach(o => o.isSelected = false);
    opt.isSelected = true;
  }
  onOpenQuestionBoard(){}
  onTranslate(){}
  onMarkQuestion(){}
  nextQuestion(){}
  previousQuestion(){}
}
