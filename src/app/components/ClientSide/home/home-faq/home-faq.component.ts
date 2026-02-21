// src\app\components\ClientSide\home\home-faq\home-faq.component.ts
import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { Shared } from '../../../../shared/Services/shared/shared';
import { FeatureComponent } from '../../../../shared/clientSide/feature/feature.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { FaqItemComponent } from '../../../../shared/faq-item/faq-item.component';

@Component({
  selector: 'app-home-faq',
  standalone: true,
  imports: [TranslateModule, TranslatePipe, FeatureComponent
    , SiteButtonComponent, FaqItemComponent
  ],
  templateUrl: './home-faq.component.html',
  styleUrl: './home-faq.component.scss'
})
export class HomeFAQComponent {
  protected readonly shared = inject(Shared);
  private currentCertification = this.shared.currentCertificate
  // You need to provide this array – can come from service, input, or static
  questions = [
    {
      question: 'faq.question1',
      answer: 'faq.answer1'
    },
    {
      question: 'faq.question2',
      answer: 'faq.answer2'
    },
    {
      question: 'faq.question3',
      answer: 'faq.answer3'
    },
    {
      question: 'faq.question4',
      answer: 'faq.answer4'
    },
    {
      question: 'faq.question5',
      answer: 'faq.answer5'
    },

  ];

  pmpQuestions = [
    {
      question: 'pmpFaq.question1',
      answer: 'pmpFaq.answer1'
    },
    {
      question: 'pmpFaq.question2',
      answer: 'pmpFaq.answer2'
    },
    {
      question: 'pmpFaq.question3',
      answer: 'pmpFaq.answer3'
    },
    {
      question: 'pmpFaq.question4',
      answer: 'pmpFaq.answer4'
    },
    {
      question: 'pmpFaq.question5',
      answer: 'pmpFaq.answer5'
    },

  ];

  campQuestions = [
    {
      question: 'campFaq.question1',
      answer: 'campFaq.answer1'
    },
    {
      question: 'campFaq.question2',
      answer: 'campFaq.answer2'
    },
    {
      question: 'campFaq.question3',
      answer: 'campFaq.answer3'
    },
    {
      question: 'campFaq.question4',
      answer: 'campFaq.answer4'
    },
    {
      question: 'campFaq.question5',
      answer: 'campFaq.answer5'
    },

  ];

  displayedQuestions = computed(() => {
    if (this.currentCertification() == 'pmp')
      return this.pmpQuestions;
    else if (this.currentCertification() == 'capm')
      return this.campQuestions;
    else return this.questions;
  })

  onContactSupport() {
    // Replace with real action
    //console.log('Contact support clicked');
    // window.location.href = 'mailto:support@yourdomain.com';
    // or open modal, navigate to contact page, etc.
  }
}




