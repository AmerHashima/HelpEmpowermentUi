import { Component, computed, inject, input } from '@angular/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { CourseTabContentService } from '../../../../Services/course-tab-content.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-target-audience',
  imports: [AccordionComponent,TranslatePipe],
  templateUrl: './target-audience.component.html',
  styleUrl: './target-audience.component.scss'
})
export class TargetAudienceComponent {
  private shared = inject(Shared);
  tabKey = input<'recorded-course' | 'live-course'>('recorded-course');
  private tabService = inject(CourseTabContentService);
  private content = toSignal(this.tabService.getCourse(this.shared.currentCertificate()).pipe(catchError(() => of([]))), {initialValue: []});
  readonly section = computed(() => this.content().find(tab => tab.tabKey === this.tabKey())?.content.sections.find(s => s.type === 'targetAudience'));
  readonly sectionTitle = computed(() => this.section()?.header?.[this.shared.isRtl() ? 'ar' : 'en'] || 'Target Audience');
  readonly sectionDescription = computed(() => this.section()?.description?.[this.shared.isRtl() ? 'ar' : 'en'] || '');
  displayAudiences = computed(() => {
    const section = this.section();
    if (!section) return this.targetAudiences();
    if (section.isEnabled === false) return [];
    const lang = this.shared.isRtl() ? 'ar' : 'en';
    return section.items.map(item => typeof item.title === 'string' ? item.title : item.title?.[lang] ?? '');
  });
  certification = this.shared.currentCertificate;


  targetAudiences = computed(() => {
    if (this.certification() === 'pmp')
      return [
        'targetAudiences.pmp.0',
        'targetAudiences.pmp.1',
        'targetAudiences.pmp.2',
        'targetAudiences.pmp.3',
        'targetAudiences.pmp.4',
      ];
    else
      return     [
        'targetAudiences.capm.0',
        'targetAudiences.capm.1',
        'targetAudiences.capm.2',
        'targetAudiences.capm.3',
        'targetAudiences.capm.4',
      ];;
  });
  readonly accordionTitle = 'Target Audience';
}
