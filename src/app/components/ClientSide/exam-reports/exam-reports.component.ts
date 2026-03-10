import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ExamReportCardComponent } from '../../../../components/ClientSide/exam-report-card/exam-report-card.component';

@Component({
  selector: 'app-exam-reports',
  imports: [TranslatePipe, ExamReportCardComponent],
  templateUrl: './exam-reports.component.html',
  styleUrl: './exam-reports.component.scss'
})
export class ExamReportsComponent {
reports=signal<any[]>([]);
  onViewLessons() {
    console.log('View lessons clicked');
  }

  onCheckPerformance() {
    console.log('Check performance clicked');
  }
}
