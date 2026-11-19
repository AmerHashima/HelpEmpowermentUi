// src\app\components\ClientSide\calendar\calendar.component.ts
import { Component, computed, inject } from '@angular/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { PageBannerComponent } from '../../../shared/clientSide/page-banner/page-banner.component';
import { CalendarCardComponent } from './calendar-card/calendar-card.component';
import { WebinarService } from '../../../Services/webinar.service';
import { LiveCourseService } from '../../../Services/live-course.service';
import { Router } from '@angular/router';

export interface CalendarItem {
  title: string;
  icon: string;
  startDate: string;
  endDate?: string;
  courseCode: string;
  type: 'webinar' | 'liveCourse';
}

@Component({
  selector: 'app-calendar',
  imports: [TranslateModule,TranslatePipe,PageBannerComponent,
    CalendarCardComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  private shared = inject(Shared);
  private webinarService=inject(WebinarService);
  private liveCourseService=inject(LiveCourseService);
  private router=inject(Router);
  isRTL = this.shared.isRtl;

  private getCourseCode(courseOid: string): string {
    const course = (this.shared.certifications() ?? []).find(
      (item: any) => item.oid === courseOid
    );
    return String(course?.courseCode ?? '').trim().toLowerCase();
  }

  calendarData = computed(() => {

    const webinars = this.webinarService.webinars()
      .filter(w => w.isActive)
      .map(w => {
        const start = new Date(`${w.webinarDate.split('T')[0]}T${w.webinarStartTime}`);
        const end = new Date(`${w.webinarDate.split('T')[0]}T${w.webinarEndTime}`);

        return {
          title: w.webinarName,
          icon: 'bi bi-camera-video',
          startDate: this.formatDate(start),
          endDate: this.formatDate(end),
          courseCode: this.getCourseCode(w.courseOid),
          type: 'webinar',
          sortTimestamp: start.getTime()
        };
      });

    const liveCourses = this.liveCourseService.liveCourses()
      .filter(c => c.isActive)
      .map(c => ({
        title: c.courseName,
        courseCode: this.getCourseCode(c.courseOid),
        icon: 'bi bi-mortarboard',
        startDate: this.formatDate(new Date(c.startDate)),
        // endDate: this.calculateEndDate(
        //   c.startDate,
        //   c.numberOfSessions
        // ),
        type: 'liveCourse',
        sortTimestamp: new Date(c.startDate).getTime()
      }));

    return [...webinars, ...liveCourses]
      .sort((a, b) => a.sortTimestamp - b.sortTimestamp);
  });
  // calendarData = [
  //   {
  //     title: "PMP Live Course",
  //     icon: "bi bi-camera-video",
  //     startDate: "20-Feb-26",
  //     endDate: "20-Mar-26",
  //     route: "",
  //   },
  //   {
  //     title: "PMP Webinar",
  //     icon: "bi bi-camera-video",
  //     startDate: "20-Feb-26",
  //     endDate: "20-Mar-26",
  //     route: "",
  //   },
  //   {
  //     title: "capm Course",
  //     icon: "bi bi-camera-video",
  //     startDate: "20-Feb-26",
  //     endDate: "20-Mar-26",
  //     route: "",
  //   },
  //   {
  //     title: "capm Webinar",
  //     icon: "bi bi-camera-video",
  //     startDate: "20-Feb-26",
  //     endDate: "20-Mar-26",
  //     route: "",
  //   },
  // ];


  onCardClick(item: CalendarItem) {
    if (!item.courseCode) return;

    const path = item.type === 'webinar' ? 'webinar' : 'live-course';
    this.router.navigate(['/', this.shared.lang(), 'certifications', item.courseCode, path]);
  }

  //Helpers

  calculateEndDate(
    startDate: string,
    sessions?: number
  ): string {

    const start = new Date(startDate);

    const days = (sessions ?? 1) * 7;

    start.setDate(start.getDate() + days);

    return this.formatDate(start);
  }
  formatDate(date: Date): string {
    return date.toLocaleDateString(this.shared.lang() === 'ar' ? 'ar-EG' : 'en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
