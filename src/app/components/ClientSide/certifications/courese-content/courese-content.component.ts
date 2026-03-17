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
    return [
      { title: 'courseCon.session1.title', duration: 'courseCon.session1.duration' },
      { title: 'courseCon.session2.title', duration: 'courseCon.session2.duration' },
      { title: 'courseCon.session3.title', duration: 'courseCon.session3.duration' },
      { title: 'courseCon.session4.title', duration: 'courseCon.session4.duration' },
      { title: 'courseCon.session5.title', duration: 'courseCon.session5.duration' },
      { title: 'courseCon.session6.title', duration: 'courseCon.session6.duration' },
      { title: 'courseCon.session7.title', duration: 'courseCon.session7.duration' },
      { title: 'courseCon.session8.title', duration: 'courseCon.session8.duration' },
      { title: 'courseCon.session9.title', duration: 'courseCon.session9.duration' },
      { title: 'courseCon.session10.title', duration: 'courseCon.session10.duration' },
      { title: 'courseCon.session11.title', duration: 'courseCon.session11.duration' },
      { title: 'courseCon.session12.title', duration: 'courseCon.session12.duration' },
      { title: 'courseCon.session13.title', duration: 'courseCon.session13.duration' },
      { title: 'courseCon.session14.title', duration: 'courseCon.session14.duration' },
      { title: 'courseCon.session15.title', duration: 'courseCon.session15.duration' },
      { title: 'courseCon.session16.title', duration: 'courseCon.session16.duration' },
      { title: 'courseCon.session17.title', duration: 'courseCon.session17.duration' },
      { title: 'courseCon.session18.title', duration: 'courseCon.session18.duration' },
      { title: 'courseCon.session19.title', duration: 'courseCon.session19.duration' },
      { title: 'courseCon.session20.title', duration: 'courseCon.session20.duration' }
    ];
  });
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
