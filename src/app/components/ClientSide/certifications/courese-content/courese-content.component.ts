import { Component, effect, input, signal } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { SimpleCheckboxComponent } from '../../../../shared/simple-checkbox/simple-checkbox.component';

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
  // input array of lessons
  courseCon = input.required<CourseItem[]>();

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
