// src\app\components\ClientSide\home\home-faq\home-faq.component.ts
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

import { Shared } from '../../../../shared/Services/shared/shared';
import { FeatureComponent } from '../../../../shared/clientSide/feature/feature.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { FaqItemComponent } from '../../../../shared/faq-item/faq-item.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseTabContentService } from '../../../../Services/course-tab-content.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { CourseTabContent } from '../../../../models/course-tab-content';

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
  courseSpecific = input(false);
  tabContent = input<CourseTabContent | null>(null);
  fetchContent = input(true);
  protected readonly shared = inject(Shared);
  private currentCertification = this.shared.currentCertificate;
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tabService = inject(CourseTabContentService);
  private courseFaqCode = computed(() =>
    this.courseSpecific() && this.fetchContent() ? this.currentCertification() : ''
  );
  private faqContent = toSignal(toObservable(this.courseFaqCode).pipe(
    switchMap(code => code
      ? this.tabService.getTab(code, 'faq').pipe(catchError(() => of(null)))
      : of(null))
  ), { initialValue: null });

  private readonly systemQuestions = [
    { question: 'faq.question1', answer: 'faq.answer1' },
    { question: 'faq.question2', answer: 'faq.answer2' },
    { question: 'faq.question3', answer: 'faq.answer3' },
    { question: 'faq.question4', answer: 'faq.answer4' },
    { question: 'faq.question5', answer: 'faq.answer5' }
  ];
  displayedQuestions = computed(() => {
    if (!this.courseSpecific()) return this.systemQuestions;

    const section = this.faqSection();
    if (!section) return [];

    const lang = this.shared.isRtl() ? 'ar' : 'en';
    return (section.items ?? [])
      .map(item => ({
        question: typeof item.title === 'string' ? item.title : item.title?.[lang] ?? '',
        answer: typeof item.description === 'string' ? item.description : item.description?.[lang] ?? ''
      }))
      .filter(item => item.question.trim() || item.answer.trim());
  })

  private readonly resolvedFaqContent = computed(() => this.tabContent() ?? this.faqContent());
  readonly faqSection = computed(() => this.resolvedFaqContent()?.content.sections.find(s => s.type === 'faq'));
  readonly faqTitle = computed(() =>
    this.courseSpecific()
      ? this.faqSection()?.header?.[this.shared.isRtl() ? 'ar' : 'en']?.trim()
        || (this.shared.isRtl()
          ? `الأسئلة الشائعة عن ${this.currentCertification()?.toUpperCase() ?? ''}`
          : `${this.currentCertification()?.toUpperCase() ?? ''} Frequently Asked Questions`)
      : 'home.faq.title'
  );
  readonly faqDescription = computed(() =>
    this.courseSpecific()
      ? this.faqSection()?.description?.[this.shared.isRtl() ? 'ar' : 'en']?.trim()
        || (this.shared.isRtl()
          ? `إجابات واضحة عن أكثر الأسئلة شيوعًا حول ${this.currentCertification()?.toUpperCase() ?? ''}.`
          : `Clear answers to the most common ${this.currentCertification()?.toUpperCase() ?? ''} questions.`)
      : 'home.faq.description'
  );

  onContactSupport() {
    this.router.navigate([this.shared.isRtl() ? 'ar/contact' : 'en/contact']);
  }
}




