import { Component, effect, input, signal } from '@angular/core';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { LessonSidebarComponent } from '../lesson-sidebar/lesson-sidebar.component';
import { NgIf } from '@angular/common';

export interface Lesson {
  id: number | string;
  title?: string;
  videoUrl: string;
  duration?: string;
  unlocked:boolean
  watched: boolean,
  // add any other fields your lessons have
}

@Component({
  selector: 'app-course-player',
  imports: [VideoPlayerComponent,LessonSidebarComponent,NgIf],
  templateUrl: './courese-player.component.html',
  styleUrl: './courese-player.component.scss'
})
export class CouresePlayerComponent {
  // Input: array of lessons
  lessons = input.required<Lesson[]>();

  // Reactive state using signals
  lessonState = signal<Lesson[]>([]);

  currentLesson = signal<Lesson | null>(null);

  // Initialize state when lessons input changes
  constructor() {
    // React to input changes (similar to useEffect)
    effect(() => {
      const incomingLessons = this.lessons();

      if (incomingLessons?.length > 0) {
        // Initialize state: first lesson unlocked, others locked
        const initialized = incomingLessons.map((lesson, index) => ({
          ...lesson,
          watched: false,
          unlocked: index === 0
        }));

        this.lessonState.set(initialized);

        // Set first unlocked lesson as current
        const firstUnlocked = initialized.find(l => l.unlocked);
        if (firstUnlocked) {
          this.currentLesson.set(firstUnlocked);
        }
      }
    });
  }

  // Called when current video ends
  handleLessonEnd(lessonId: number | string) {
    this.lessonState.update(prev =>
      prev.map(l => {
        if (l.id === lessonId) {
          return { ...l, watched: true };
        }
        // Unlock the next lesson
        const currentIndex = prev.findIndex(item => item.id === lessonId);
        if (currentIndex >= 0 && currentIndex + 1 < prev.length) {
          if (prev[currentIndex].id === lessonId) {
            return { ...prev[currentIndex + 1], unlocked: true };
          }
        }
        return l;
      })
    );
  }

  // Called when user clicks a lesson in sidebar
  handleSelectLesson(lesson: Lesson) {
    if (!lesson.unlocked) return; // cannot select locked lesson

    this.currentLesson.set(lesson);
  }
}
