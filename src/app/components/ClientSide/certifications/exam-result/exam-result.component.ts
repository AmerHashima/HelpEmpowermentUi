import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { PerformanceIndicatorsTableComponent } from '../../../../../components/ClientSide/performance-indicators-table/performance-indicators-table.component';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';

@Component({
  selector: 'app-exam-result',
  imports: [TranslatePipe, NgClass, PerformanceIndicatorsTableComponent,SiteButtonComponent],
  templateUrl: './exam-result.component.html',
  styleUrl: './exam-result.component.scss',
})
export class ExamResultComponent {
  private shared=inject(Shared);
  private router=inject(Router);
  private route=inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);
  isRTL=this.shared.isRtl;
  examResult=signal<any>(null);

  storageKey: string='';

  score = computed(() => this.examResult()?.obtainedScore ?? 0);
  totalScore = computed(() => this.examResult()?.totalScore ?? 0);

  scoreCategory = computed(() => this.shared.getScoreCategory(this.score(), this.totalScore())

  );

  scoreLabel = computed(() => this.shared.getScoreLabel(this.score(), this.totalScore()));


  getResultKey(): string {
    const examId = this.shared.currentExamId();

    const studentExamId = this.shared.studentExamId();

    return studentExamId ? `examResult-${studentExamId}` : `examResult-freeEXam-${examId}`;
  }

  isFreeExam(): boolean {

    const studentExamId = this.shared.studentExamId();

    return !studentExamId ;
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const key = this.getResultKey();
    const stored = localStorage.getItem(key);
    const isFree = this.isFreeExam();

    this.examResult.set(stored ? JSON.parse(stored) : null);

    if (stored) {
      localStorage.removeItem(key);

      if (!isFree) {
        localStorage.removeItem('studentExamId');
      }
    }

    if (!this.examResult()) {
      this.router.navigateByUrl(`${this.shared.lang()}/home`);
      return;
    }
  }

  Done(){
    this.router.navigate(['../chooseExam'], {
      relativeTo: this.route,
    });
  }
}
