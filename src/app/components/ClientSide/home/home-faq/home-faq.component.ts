// src\app\components\ClientSide\home\home-faq\home-faq.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { Shared } from '../../../../shared/Services/shared/shared';
import { FeatureComponent } from '../../../../shared/clientSide/feature/feature.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { FaqItemComponent } from '../../../../shared/faq-item/faq-item.component';

@Component({
  selector: 'app-home-faq',
  standalone:true,
  imports: [TranslateModule,TranslatePipe,FeatureComponent
    , SiteButtonComponent, FaqItemComponent
  ],
  templateUrl: './home-faq.component.html',
  styleUrl: './home-faq.component.scss'
})
export class HomeFAQComponent {
  protected readonly shared = inject(Shared);

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

  onContactSupport() {
    // Replace with real action
    //console.log('Contact support clicked');
    // window.location.href = 'mailto:support@yourdomain.com';
    // or open modal, navigate to contact page, etc.
  }
}




