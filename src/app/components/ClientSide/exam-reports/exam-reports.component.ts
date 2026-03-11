// src\app\components\ClientSide\exam-reports\exam-reports.component.ts
import { Component, computed, effect, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ExamReportCardComponent } from '../../../../components/ClientSide/exam-report-card/exam-report-card.component';
import { StudentExamService } from '../../../Services/student-exam.service';
import { AuthService } from '../../../Services/auth.service';
import { DatePipe } from '@angular/common';
import { APIStudentExamResponse } from '../../../models/certification';
import { Shared } from '../../../shared/Services/shared/shared';

@Component({
  selector: 'app-exam-reports',
  imports: [TranslatePipe, ExamReportCardComponent, DatePipe],
  templateUrl: './exam-reports.component.html',
  providers: [DatePipe],
  styleUrl: './exam-reports.component.scss'
})
export class ExamReportsComponent {
  private studentService = inject(StudentExamService);
  private auth = inject(AuthService);
  private shared = inject(Shared);
  currentExamId = this.shared.currentExamId
  private datePipe = inject(DatePipe);
  studentId = computed(() => this.auth.loggedStudent()?.userId);
  averageScore = computed(() => {
    const reports = this.reports();

    if (!reports.length) return 0;

    const total = reports.reduce((sum, r) => {
      if (!r.totalScore) return sum;
      return sum + (r.obtainedScore / r.totalScore) * 100;
    }, 0);

    return Math.round(total / reports.length);
  });

  reports = computed(() => {
    const examId = this.currentExamId();
    const allReports = this.studentService.reports();

    return allReports.filter(
      r => r.coursesMasterExamOid === examId && r.startedAt && r.finishedAt
    );
  });

  formatDate(date: string | null): string {
    return date ? this.datePipe.transform(date, 'MMM d, y') ?? '' : '';
  }

  getDurationInMinutes(start: string | null, end: string | null): number {
    if (!start || !end) return 0;

    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();

    const diffMs = endDate - startDate;

    return Math.floor(diffMs / (1000 * 60));
  }


  onViewLessons() {
    console.log('View lessons clicked');
  }

  onCheckPerformance() {
    console.log('Check performance clicked');
  }
}
