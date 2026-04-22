import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { AuthService } from '../../../../Services/auth.service';
import { StudentService } from '../../../../Services/student-service.service';
import { WebinarService } from '../../../../Services/webinar.service';
import { LiveCourseService } from '../../../../Services/live-course.service';
import { ApiWebinar } from '../../../../models/webinar';

interface Session {
  date: string;
  time: string;
title: string;
}

@Component({
  selector: 'app-upcoming-sessions',
  imports: [AccordionComponent,SiteButtonComponent,TranslatePipe],
  templateUrl: './upcoming-sessions.component.html',
  styleUrl: './upcoming-sessions.component.scss'
})
export class UpcomingSessionsComponent {
    private shared = inject(Shared);
    private currentCertification=this.shared.currentCertificate;
    private webinarService = inject(WebinarService);
    private liveCourseService=inject(LiveCourseService);
    private auth = inject(AuthService);
    isRTL = this.shared.isRtl;
    // hasBought = this.auth.hasBought;
  private studentService = inject(StudentService);
  isEnrolled = this.studentService.isLiveCourseEnrolled;
  sessions = computed(() => {
    if (this.type() === 'webinar') {
      // return this.webinarService.mapWebinarsToSessions().filter(session => session.courseName?.toLowerCase() === this.currentCertification().toLowerCase());
      return  [{
          date: 'sessions.date.jan15',
          time: 'sessions.time.morningSlot',
          title: 'sessions.webinar.session1'
        }]

    } else {
      return this.liveCourseService.mapCoursesToSessions().filter(session => session.courseName?.toLowerCase() === this.currentCertification().toLowerCase());
        // {
        //   date: 'sessions.date.jan15',
        //   time: 'sessions.time.morningSlot',
        //   title: 'sessions.course.integration'
        // },
        // {
        //   date: 'sessions.date.jan16',
        //   time: 'sessions.time.morningSlot',
        //   title: 'sessions.course.integration'
        // },
        // {
        //   date: 'sessions.date.jan17',
        //   time: 'sessions.time.morningSlot',
        //   title: 'sessions.course.integration'
        // }

    }
  });

  title = input<string>('Upcoming Live Sessions');
  type = input<string>('Live Sessions');
  register = output<void>();

  constructor(){
    effect(()=>console.log('sessions',this.sessions()));
  }
  //   bookNow(session:any){

  // }


}
