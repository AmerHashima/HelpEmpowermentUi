import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { ServiceCardComponent } from '../../../ClientSide/services/service-card/service-card.component';
import { Shared } from '../../../../shared/Services/shared/shared';
import { CourseTabContentService } from '../../../../Services/course-tab-content.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
interface InstructorData {
  introParagragh: string;
  skills: any[];
  certifcations: string[];
}
@Component({
  selector: 'app-instructor-info',
  imports: [
    CommonModule,
    TranslateModule,
    AccordionComponent,
    ServiceCardComponent
  ],
  templateUrl: './instructor-info.component.html',
  styleUrl: './instructor-info.component.scss'
})
export class InstructorInfoComponent {
  private shared = inject(Shared);
  tabKey = input<'recorded-course' | 'live-course'>('recorded-course');
  private tabService = inject(CourseTabContentService);
  private tabContents = toSignal(this.tabService.getCourse(this.shared.currentCertificate()).pipe(catchError(() => of([]))), {initialValue: []});
  readonly introSection = computed(() => this.tabContents().find(tab => tab.tabKey === this.tabKey())?.content.sections.find(s => s.type === 'instructorIntro'));
  readonly sectionTitle = computed(() => this.introSection()?.header?.[this.shared.isRtl() ? 'ar' : 'en'] || 'instructor.info');
  readonly sectionDescription = computed(() => this.introSection()?.description?.[this.shared.isRtl() ? 'ar' : 'en'] || '');
  certification = this.shared.currentCertificate;

  private fallbackInstructor = {
    introParagragh: 'instructor.introParagragh',

    skills: [
      {
        icon: "bi bi-person-badge",
        header: "instructor.skills.0.header",
        text: "instructor.skills.0.text"
      },
      {
        icon: "bi bi-briefcase",
        header: "instructor.skills.1.header",
        text: "instructor.skills.1.text"
      },
      {
        icon: "bi bi-building",
        header: "instructor.skills.2.header",
        text: "instructor.skills.2.text"
      },
      {
        icon: "bi bi-bar-chart",
        header: "instructor.skills.3.header",
        text: "instructor.skills.3.text"
      }
    ],

    certifcations: [
      "instructor.certifications.0",
      "instructor.certifications.1",
      "instructor.certifications.2",
      "instructor.certifications.3",
      "instructor.certifications.4",
      "instructor.certifications.5",
      "instructor.certifications.6",
      "instructor.certifications.7",
      "instructor.certifications.8",
      "instructor.certifications.9",
      "instructor.certifications.10",
      "instructor.certifications.11",
      "instructor.certifications.12",
      "instructor.certifications.13",
      "instructor.certifications.14"
    ]
  };
  instructor = computed(() => {
    const sections = this.tabContents().find(tab => tab.tabKey === this.tabKey())?.content.sections ?? [];
    const intro = sections.find(s => s.type === 'instructorIntro' && s.isEnabled !== false)?.items[0];
    const skills = sections.find(s => s.type === 'instructorSkills' && s.isEnabled !== false)?.items;
    const certs = sections.find(s => s.type === 'instructorCertifications' && s.isEnabled !== false)?.items;
    if (!intro && !skills?.length && !certs?.length) return this.fallbackInstructor;
    const lang = this.shared.isRtl() ? 'ar' : 'en';
    const localize = (value: string | {en: string; ar: string} | undefined) =>
      typeof value === 'string' ? value : value?.[lang] ?? '';
    return {
      introParagragh: localize(intro?.title),
      skills: (skills ?? []).map(item => ({icon: item.icon || 'bi bi-award', header: localize(item.title), text: localize(item.description)})),
      certifcations: (certs ?? []).map(item => localize(item.title))
    };
  });
  readonly accordionTitle = 'instructor.info'
}
