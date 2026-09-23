import { Component, computed, inject, input } from '@angular/core';
import { CourseCustomSection, CourseTabSection } from '../../../../models/course-tab-content';
import { Shared } from '../../../../shared/Services/shared/shared';

@Component({
  selector: 'app-course-custom-sections',
  imports: [],
  templateUrl: './course-custom-sections.component.html',
  styleUrl: './course-custom-sections.component.scss'
})
export class CourseCustomSectionsComponent {
  private readonly shared = inject(Shared);
  readonly sections = input<CourseTabSection[]>([]);
  readonly isRTL = this.shared.isRtl;
  readonly visibleSections = computed(() =>
    this.sections()
      .filter((section): section is CourseCustomSection =>
        section.type === 'custom' && !!section.id && !!section.header &&
        !!section.description && section.isEnabled !== false)
      .sort((a, b) => a.orderNo - b.orderNo)
  );
}
