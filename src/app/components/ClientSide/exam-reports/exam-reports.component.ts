import { Component, computed, effect, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ExamReportCardComponent } from '../../../../components/ClientSide/exam-report-card/exam-report-card.component';
import { StudentExamService } from '../../../Services/student-exam.service';
import { AuthService } from '../../../Services/auth.service';
import { APIStudentExamResponse } from '../../../models/certification';
import { Shared } from '../../../shared/Services/shared/shared';

@Component({
  selector: 'app-exam-reports',
  imports: [TranslatePipe, ExamReportCardComponent],
  templateUrl: './exam-reports.component.html',
  styleUrl: './exam-reports.component.scss'
})
export class ExamReportsComponent {
  private studentService = inject(StudentExamService);
  private auth = inject(AuthService);
  private shared = inject(Shared);
  currentExamId = this.shared.currentExamId
  currentExam = this.shared.currentExam
  isFreeExam = computed(() => this.currentExam()?.freeExam)
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
    const exam = this.currentExam();

    if (!examId || !exam) return [];

    // ✅ CASE 1: Free Exam → from localStorage
    if (exam.freeExam) {
      const localResults = this.getLocalResults();

      return [...localResults
        .filter(r => r.coursesMasterExamOid === examId)
        .map((r, index) => ({
          ...r,
          attemptNo: index + 1,

        }))
        .sort((a, b) => (b.attemptNo ?? 0) - (a.attemptNo ?? 0))
      ];
    }

    // ✅ CASE 2: Normal Exam → from API
    const allReports = this.studentService.reports();

    return [...allReports
      .filter(r => r.coursesMasterExamOid === examId)
      .sort((a, b) => (b.attemptNo ?? 0) - (a.attemptNo ?? 0))
    ];
  });
  // reports = computed(() => {
  //   const examId = this.currentExamId();
  //   const allReports = this.studentService.reports();

  //   return [...allReports
  //     .filter(r =>
  //       r.coursesMasterExamOid === examId
  //     )
  //     .sort((a, b) => (b.attemptNo ?? 0) - (a.attemptNo ?? 0))
  //   ];
  // });
  formatDate(date: string | null): string {
    if (!date) return '';

    return new Intl.DateTimeFormat(this.shared.lang() === 'ar' ? 'ar-EG' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  }

  getDurationInMinutes(start: string | null, end: string | null): number {
    if (!start || !end) return 0;

    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();

    const diffMs = endDate - startDate;

    return Math.floor(diffMs / (1000 * 60));
  }


  onViewLessons() {
  }

  onCheckPerformance() {
  }

  private getLocalResults(): APIStudentExamResponse[] {
    const userId = this.auth.loggedStudent()?.userId;
    if (!userId) return [];

    const key = this.shared.getExamResultsKey(userId);
    if (!key) return [];
    const data = localStorage.getItem(key);

    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

}
