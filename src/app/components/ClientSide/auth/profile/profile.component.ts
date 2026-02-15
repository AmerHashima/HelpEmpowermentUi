import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../Services/auth.service';
import { Shared } from '../../../../shared/Services/shared/shared';
import { DatePipe, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [NgClass,DatePipe,NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private shared = inject(Shared);
  isRTL=this.shared.isRtl
  // private courseService = inject(CourseService);

  user = this.authService.loggedStudent();

  enrolledCourses = [
    { id: 1, title: 'Angular Advanced Techniques', progress: 65, image: 'assets/courses/angular.jpg', instructor: 'John Doe' },
    { id: 2, title: 'UI/UX Design Mastery', progress: 30, image: 'assets/courses/uiux.jpg', instructor: 'Jane Smith' },
    // ...
  ];

  ongoingExams = [
    { id: 101, title: 'Midterm Exam - Angular', dueDate: '2026-02-28', status: 'In Progress', score: null },
    { id: 102, title: 'Quiz 3 - Responsive Design', dueDate: '2026-02-20', status: 'Pending', score: null },
    // ...
  ];

}
