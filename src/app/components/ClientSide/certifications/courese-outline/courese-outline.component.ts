import { Component, computed, inject, input } from '@angular/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { CourseTabContentService } from '../../../../Services/course-tab-content.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-courese-outline',
  imports: [AccordionComponent,TranslateModule,TranslatePipe],
  templateUrl: './courese-outline.component.html',
  styleUrl: './courese-outline.component.scss'
})
export class CoureseOutlineComponent {
  private shared=inject(Shared);
  tabKey=input<'recorded-course' | 'live-course'>('recorded-course');
  private tabService=inject(CourseTabContentService);
  private content=toSignal(this.tabService.getCourse(this.shared.currentCertificate()).pipe(catchError(() => of([]))), {initialValue: []});
  readonly section=computed(() => this.content().find(tab => tab.tabKey === this.tabKey())?.content.sections.find(s => s.type === 'outline'));
  readonly sectionTitle=computed(() => this.section()?.header?.[this.shared.isRtl() ? 'ar' : 'en'] || 'courseOutline');
  readonly sectionDescription=computed(() => this.section()?.description?.[this.shared.isRtl() ? 'ar' : 'en'] || '');
  readonly displayOutlines=computed(() => {
    const section=this.section();
    if (!section) return this.courseOutlines();
    if (section.isEnabled === false) return [];
    const lang=this.shared.isRtl() ? 'ar' : 'en';
    return section.items.map(item => typeof item.title === 'string' ? item.title : item.title?.[lang] ?? '');
  });
  certification=this.shared.currentCertificate;
  courseOutlines = computed(() => {
    if (this.certification() === 'pmp')
      return [
        'courseOutlines.pmp.0',
        'courseOutlines.pmp.1',
        'courseOutlines.pmp.2',
        'courseOutlines.pmp.3',
        'courseOutlines.pmp.4',
        'courseOutlines.pmp.5',
        'courseOutlines.pmp.6',
        'courseOutlines.pmp.7',
        'courseOutlines.pmp.8',
        'courseOutlines.pmp.9',
      ];
    else
      return [
        'courseOutlines.capm.0',
        'courseOutlines.capm.1',
        'courseOutlines.capm.2',
        'courseOutlines.capm.3',
        'courseOutlines.capm.4',
        'courseOutlines.capm.5',
        'courseOutlines.capm.6',
        'courseOutlines.capm.7',
        'courseOutlines.capm.8',
      ];
  });
}
