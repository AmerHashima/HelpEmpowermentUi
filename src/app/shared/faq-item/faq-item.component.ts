import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../Services/shared/shared';


export interface FaqItem {
  question: string;   // translation key e.g. 'faq.question1'
  answer: string;     // translation key e.g. 'faq.answer1'
}

@Component({
  selector: 'app-faq-item',
  imports: [TranslateModule,TranslatePipe],
  templateUrl: './faq-item.component.html',
  styleUrl: './faq-item.component.scss'
})
export class FaqItemComponent {
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;
  questions = input.required<FaqItem[]>();
}





