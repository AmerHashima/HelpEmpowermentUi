import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { SimpleCheckboxComponent } from '../../../../shared/simple-checkbox/simple-checkbox.component';
import { Shared } from '../../../../shared/Services/shared/shared';

interface CourseItem {
  title: string;
  duration: string;
  url?: string;
  locked?: boolean;
  watched?: boolean;
}

@Component({
  selector: 'app-courese-content',
  imports: [TranslateModule, TranslatePipe, AccordionComponent, SimpleCheckboxComponent],
  templateUrl: './courese-content.component.html',
  styleUrl: './courese-content.component.scss',
})
export class CoureseContentComponent {
  private shared = inject(Shared);
  certification = this.shared.currentCertificate;
  // input array of lessons

  courseCon = computed(() => {
    if (this.certification() == 'pmp')
      return [
        { title: "Session (1) – PMI & PMP Introduction", duration: "2:00" },
        { title: "Session (2) – Framework Part 1", duration: "3:00" },
        { title: "Session (3) – Framework Part 2", duration: "3:00" },
        { title: "Session (4) – Agile", duration: "2:00" },
        { title: "Session (5) – Questions", duration: "2:00" },
        { title: "Session (6) – 49 Processes", duration: "4:00" },
        { title: "Session (7) – Integration", duration: "2:00" },
        { title: "Session (8) – Scope", duration: "2:00" },
        { title: "Session (9) – Questions", duration: "2:00" },
        { title: "Session (10) – Schedule", duration: "2:00" },
        { title: "Session (11) – Cost", duration: "2:00" },
        { title: "Session (12) – Quality", duration: "2:00" },
        { title: "Session (13) – Resource", duration: "2:00" },
        { title: "Session (14) – Questions", duration: "2:00" },
        { title: "Session (15) – Communication", duration: "2:00" },
        { title: "Session (16) – Risk", duration: "2:00" },
        { title: "Session (17) – Procurement", duration: "2:00" },
        { title: "Session (18) – Stakeholders", duration: "2:00" },
        { title: "Session (19) – Questions", duration: "2:00" },
        { title: "Session (20) – Revision", duration: "3:00" },
      ]
    else
      return [
        { title: "Session (1) – PMI & PMP Introduction", duration: "2:00" },
        { title: "Session (2) – Framework Part 1", duration: "3:00" },
        { title: "Session (3) – Framework Part 2", duration: "3:00" },
        { title: "Session (4) – Agile", duration: "2:00" },
        { title: "Session (5) – Questions", duration: "2:00" },
        { title: "Session (6) – 49 Processes", duration: "4:00" },
        { title: "Session (7) – Integration", duration: "2:00" },
        { title: "Session (8) – Scope", duration: "2:00" },
        { title: "Session (9) – Questions", duration: "2:00" },
        { title: "Session (10) – Schedule", duration: "2:00" },
        { title: "Session (11) – Cost", duration: "2:00" },
        { title: "Session (12) – Quality", duration: "2:00" },
        { title: "Session (13) – Resource", duration: "2:00" },
        { title: "Session (14) – Questions", duration: "2:00" },
        { title: "Session (15) – Communication", duration: "2:00" },
        { title: "Session (16) – Risk", duration: "2:00" },
        { title: "Session (17) – Procurement", duration: "2:00" },
        { title: "Session (18) – Stakeholders", duration: "2:00" },
        { title: "Session (19) – Questions", duration: "2:00" },
        { title: "Session (20) – Revision", duration: "3:00" },
      ]

  })
  // signal to store checkbox states
  checkedState = signal<Record<string, boolean>>({});

  constructor() {
    // initialize checkbox states
    effect(() => {
      const items = this.courseCon();
      if (!items?.length) return;

      const initialState = items.reduce((acc, item) => {
        const safeName = this.getSafeName(item.title);
        acc[safeName] = false;
        return acc;
      }, {} as Record<string, boolean>);

      this.checkedState.set(initialState);
    });
  }

  getSafeName(title: string): string {
    return title.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  // called when checkbox changes
  onCheckboxChange(safeName: string, checked: boolean) {
    console.log(checked);
    this.checkedState.update(prev => ({
      ...prev,
      [safeName]: checked
    }));
  }

  readonly accordionTitle = 'Course Content';
}
