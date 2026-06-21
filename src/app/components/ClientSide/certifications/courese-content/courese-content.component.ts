import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { SimpleCheckboxComponent } from '../../../../shared/simple-checkbox/simple-checkbox.component';
import { Shared } from '../../../../shared/Services/shared/shared';
import { CourseVideo } from '../../../../models/course-video';
import { StudentService } from '../../../../Services/student-service.service';

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
  private studentService=inject(StudentService);
  lessonsWatched=this.studentService.completedLessonsInCourse;
  isRTL=this.shared.isRtl;
  videos=input<CourseVideo[]>([]);
  certification = this.shared.currentCertificate;
  // input array of lessons

  // courseCon = computed(() => {
  //   return [
  //     { title: 'courseCon.session1.title', duration: 'courseCon.session1.duration' },
  //     { title: 'courseCon.session2.title', duration: 'courseCon.session2.duration' },
  //     { title: 'courseCon.session3.title', duration: 'courseCon.session3.duration' },
  //     { title: 'courseCon.session4.title', duration: 'courseCon.session4.duration' },
  //     { title: 'courseCon.session5.title', duration: 'courseCon.session5.duration' },
  //     { title: 'courseCon.session6.title', duration: 'courseCon.session6.duration' },
  //     { title: 'courseCon.session7.title', duration: 'courseCon.session7.duration' },
  //     { title: 'courseCon.session8.title', duration: 'courseCon.session8.duration' },
  //     { title: 'courseCon.session9.title', duration: 'courseCon.session9.duration' },
  //     { title: 'courseCon.session10.title', duration: 'courseCon.session10.duration' },
  //     { title: 'courseCon.session11.title', duration: 'courseCon.session11.duration' },
  //     { title: 'courseCon.session12.title', duration: 'courseCon.session12.duration' },
  //     { title: 'courseCon.session13.title', duration: 'courseCon.session13.duration' },
  //     { title: 'courseCon.session14.title', duration: 'courseCon.session14.duration' },
  //     { title: 'courseCon.session15.title', duration: 'courseCon.session15.duration' },
  //     { title: 'courseCon.session16.title', duration: 'courseCon.session16.duration' },
  //     { title: 'courseCon.session17.title', duration: 'courseCon.session17.duration' },
  //     { title: 'courseCon.session18.title', duration: 'courseCon.session18.duration' },
  //     { title: 'courseCon.session19.title', duration: 'courseCon.session19.duration' },
  //     { title: 'courseCon.session20.title', duration: 'courseCon.session20.duration' }
  //   ];
  // });


  private readonly certificationSessions: Record<string, string[]> = {

    pmp: [
      'Session 1 - PMI & PMP Introduction',
      'Session 2 - Framework',
      'Session 3 - Framework 2',
      'Session 4 - Agile',
      'Session 5 - Questions',
      'Session 6 - 40 Processes',
      'Session 7 - Governance',
      'Session 8 - Scope',
      'Session 9 - Questions',
      'Session 10 - Schedule',
      'Session 11 - Finance',
      'Session 12 - Quality',
      'Session 13 - Resources',
      'Session 14 - Questions',
      'Session 15 - Stakeholders',
      'Session 16 - Risk',
      'Session 17 - Procurement',
      'Session 18 - Questions',
      'Session 19 - Revision',
      'Session 20 - Scheduling by MS Project'
    ],

    capm: [
      'Session 1 - PMI & CAPM Introduction',
      'Session 2 - Framework',
      'Session 3 - Framework 2',
      'Session 4 - Agile',
      'Session 5 - Questions',
      'Session 6 - 40 Processes',
      'Session 7 - Governance',
      'Session 8 - Scope',
      'Session 9 - Questions',
      'Session 10 - Schedule',
      'Session 11 - Finance',
      'Session 12 - Quality',
      'Session 13 - Resources',
      'Session 14 - Questions',
      'Session 15 - Stakeholders',
      'Session 16 - Risk',
      'Session 17 - Procurement',
      'Session 18 - Questions',
      'Session 19 - Revision',
      'Session 20 - Questions'
    ]

  };

  courseCon = computed(() => {

    const certName =

      this.certification() ??'';

    const sessions =

      this.certificationSessions[certName] ?? [];

    return sessions.map((title, index) => ({

      title,

      duration: '',

      order: index + 1

    }));

  });
  // courseCon = computed(() => {
  //   return (this.videos() ?? [])
  //     .sort((a, b) => (a.orderNo ?? 0) - (b.orderNo ?? 0))
  //     .map(video => ({
  //       title: this.getDisplayName(video),
  //       duration: this.formatDuration(video.durationSeconds),
  //       order: video.orderNo ?? 0,
  //     }));
  // });

  // getDisplayName(video: any): string {
  //   return this.isRTL()
  //     ? (video.nameAr || video.nameEn)
  //     : (video.nameEn || video.nameAr);
  // }

  // formatDuration(seconds: number | null): string {
  //   if (!seconds) return '';

  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;

  //   return `${mins}:${secs.toString().padStart(2, '0')}`;
  // }
  // signal to store checkbox states
  // checkedState = signal<Record<string, boolean>>({});

  // constructor() {
  //   // initialize checkbox states
  //   effect(() => {
  //     const items = this.courseCon();
  //     if (!items?.length) return;

  //     const initialState = items.reduce((acc, item) => {
  //       const safeName = this.getSafeName(item.title);
  //       acc[safeName] = false;
  //       return acc;
  //     }, {} as Record<string, boolean>);

  //     this.checkedState.set(initialState);
  //   });

  //   // effect(()=> console.log('courseCon', this.courseCon())); // Debugging effect to log course content
  // }

  // getSafeName(title: string): string {
  //   return title.replace(/[^a-zA-Z0-9_]/g, '_');
  // }



  // isChecked(order: number): boolean {
  //   // const completed = this.lessonsWatched() ?? 0;
  //   // return order <= completed;
  //   return false;
  // }
  readonly accordionTitle = 'Course Content';
}
