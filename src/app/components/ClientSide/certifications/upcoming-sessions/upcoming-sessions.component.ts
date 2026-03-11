import { Component, computed, inject, input, output, signal } from '@angular/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { AuthService } from '../../../../Services/auth.service';
import { StudentService } from '../../../../Services/student-service.service';

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
    private auth = inject(AuthService);
    isRTL = this.shared.isRtl;
    // hasBought = this.auth.hasBought;
  private studentService = inject(StudentService);
  isEnrolled = this.studentService.isLiveCourseEnrolled;
    sessions=computed(()=>{
      if(this.type() == 'webinar')
      return [
        {
          date: 'Jan 15, 2026',
          time: '10:00 AM - 2:00 PM EST',
          title: "The PMP Blueprint: Your Roadmap from Application to Exam Success"
        },];
      else
        return [
    {
      date: 'Jan 15, 2026',
      time: '10:00 AM - 2:00 PM EST',
      title: 'Project Integration Management'
    },
    {
      date: 'Jan 15, 2026',
      time: '10:00 AM - 2:00 PM EST',
      title: 'Project Integration Management'
    },
    {
      date: 'Jan 15, 2026',
      time: '10:00 AM - 2:00 PM EST',
      title: 'Project Integration Management'
    }
  ]
    })

  title = input<string>('Upcoming Live Sessions');
  type = input<string>('Live Sessions');
  register = output<void>();
    bookNow(session:any){

  }


}
