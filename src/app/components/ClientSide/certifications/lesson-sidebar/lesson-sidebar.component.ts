import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-lesson-sidebar',
  imports: [NgClass],
  templateUrl: './lesson-sidebar.component.html',
  styleUrl: './lesson-sidebar.component.scss'
})
export class LessonSidebarComponent {

  lessons = input.required<any[]>();
  currentLesson = input<any>();
  select = output<any>();
  visibleLessons = input<number>(6);
  maxSidebarHeight="400"

  onSelectLesson(lesson: any) {
    if (!lesson.unlocked) return;
    this.select.emit(lesson);
  }

}
