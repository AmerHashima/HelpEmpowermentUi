import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { LessonSidebarComponent } from '../lesson-sidebar/lesson-sidebar.component';
import { NgIf } from '@angular/common';
import { Shared } from '../../../../shared/Services/shared/shared';

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
  private shared = inject(Shared);
  certification = this.shared.currentCertificate;
  // Input: array of lessons
  lessons = computed<Lesson[]>(() => {
    if (this.certification() == 'pmp')
      return [
        {
          id: 1,
          title: "Session (1) – PMI & PMP Introduction",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          unlocked: false,
          watched: false,
        },
        {
          id: 2,
          title: "Session (2) – Framework Part 1",
          duration: "3:00",
          videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
          unlocked: true,
          watched: false,
        },
        {
          id: 3,
          title: "Session (3) – Framework Part 2",
          duration: "3:00",
          videoUrl: "https://www.youtube.com/embed/l482T0yNkeo",
          unlocked: true,
          watched: false,
        },
        {
          id: 4,
          title: "Session (4) – Agile",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/3tmd-ClpJxA",
          unlocked: true,
          watched: false,
        },
        {
          id: 5,
          title: "Session (5) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/2Vv-BfVoq4g",
          unlocked: true,
          watched: false,
        },
        {
          id: 6,
          title: "Session (6) – 49 Processes",
          duration: "4:00",
          videoUrl: "https://www.youtube.com/embed/fLexgOxsZu0",
          unlocked: true,
          watched: false,
        },
        {
          id: 7,
          title: "Session (7) – Integration",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/60ItHLz5WEA",
          unlocked: true,
          watched: false,
        },
        {
          id: 8,
          title: "Session (8) – Scope",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
          unlocked: true,
          watched: false,
        },
        {
          id: 9,
          title: "Session (9) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/CevxZvSJLk8",
          unlocked: true,
          watched: false,
        },
        {
          id: 10,
          title: "Session (10) – Schedule",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/YQHsXMglC9A",
          unlocked: true,
          watched: false,
        },
        {
          id: 11,
          title: "Session (11) – Cost",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/OPf0YbXqDm0",
          unlocked: true,
          watched: false,
        },
        {
          id: 12,
          title: "Session (12) – Quality",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/JGwWNGJdvx8",
          unlocked: true,
          watched: false,
        },
        {
          id: 13,
          title: "Session (13) – Resource",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/ktvTqknDobU",
          unlocked: true,
          watched: false,
        },
        {
          id: 14,
          title: "Session (14) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/450p7goxZqg",
          unlocked: true,
          watched: false,
        },
        {
          id: 15,
          title: "Session (15) – Communication",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/09R8_2nJtjg",
          unlocked: true,
          watched: false,
        },
        {
          id: 16,
          title: "Session (16) – Risk",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/RgKAFK5djSk",
          unlocked: true,
          watched: false,
        },
        {
          id: 17,
          title: "Session (17) – Procurement",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/pRpeEdMmmQ0",
          unlocked: true,
          watched: false,
        },
        {
          id: 18,
          title: "Session (18) – Stakeholders",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/7wtfhZwyrcc",
          unlocked: true,
          watched: false,
        },
        {
          id: 19,
          title: "Session (19) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/e-ORhEE9VVg",
          unlocked: true,
          watched: false,
        },
        {
          id: 20,
          title: "Session (20) – Revision",
          duration: "3:00",
          videoUrl: "https://www.youtube.com/embed/hT_nvWreIhg",
          unlocked: true,
          watched: false,
        },
      ];
    else
      return [
        {
          id: 1,
          title: "Session (1) – PMI & PMP Introduction",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          unlocked: false,
          watched: false,
        },
        {
          id: 2,
          title: "Session (2) – Framework Part 1",
          duration: "3:00",
          videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
          unlocked: true,
          watched: false,
        },
        {
          id: 3,
          title: "Session (3) – Framework Part 2",
          duration: "3:00",
          videoUrl: "https://www.youtube.com/embed/l482T0yNkeo",
          unlocked: true,
          watched: false,
        },
        {
          id: 4,
          title: "Session (4) – Agile",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/3tmd-ClpJxA",
          unlocked: true,
          watched: false,
        },
        {
          id: 5,
          title: "Session (5) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/2Vv-BfVoq4g",
          unlocked: true,
          watched: false,
        },
        {
          id: 6,
          title: "Session (6) – 49 Processes",
          duration: "4:00",
          videoUrl: "https://www.youtube.com/embed/fLexgOxsZu0",
          unlocked: true,
          watched: false,
        },
        {
          id: 7,
          title: "Session (7) – Integration",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/60ItHLz5WEA",
          unlocked: true,
          watched: false,
        },
        {
          id: 8,
          title: "Session (8) – Scope",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
          unlocked: true,
          watched: false,
        },
        {
          id: 9,
          title: "Session (9) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/CevxZvSJLk8",
          unlocked: true,
          watched: false,
        },
        {
          id: 10,
          title: "Session (10) – Schedule",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/YQHsXMglC9A",
          unlocked: true,
          watched: false,
        },
        {
          id: 11,
          title: "Session (11) – Cost",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/OPf0YbXqDm0",
          unlocked: true,
          watched: false,
        },
        {
          id: 12,
          title: "Session (12) – Quality",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/JGwWNGJdvx8",
          unlocked: true,
          watched: false,
        },
        {
          id: 13,
          title: "Session (13) – Resource",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/ktvTqknDobU",
          unlocked: true,
          watched: false,
        },
        {
          id: 14,
          title: "Session (14) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/450p7goxZqg",
          unlocked: true,
          watched: false,
        },
        {
          id: 15,
          title: "Session (15) – Communication",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/09R8_2nJtjg",
          unlocked: true,
          watched: false,
        },
        {
          id: 16,
          title: "Session (16) – Risk",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/RgKAFK5djSk",
          unlocked: true,
          watched: false,
        },
        {
          id: 17,
          title: "Session (17) – Procurement",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/pRpeEdMmmQ0",
          unlocked: true,
          watched: false,
        },
        {
          id: 18,
          title: "Session (18) – Stakeholders",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/7wtfhZwyrcc",
          unlocked: true,
          watched: false,
        },
        {
          id: 19,
          title: "Session (19) – Questions",
          duration: "2:00",
          videoUrl: "https://www.youtube.com/embed/e-ORhEE9VVg",
          unlocked: true,
          watched: false,
        },
        {
          id: 20,
          title: "Session (20) – Revision",
          duration: "3:00",
          videoUrl: "https://www.youtube.com/embed/hT_nvWreIhg",
          unlocked: true,
          watched: false,
        },
      ];
  });

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
