import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { PerformanceIndicatorsTableComponent } from '../../../../../components/ClientSide/performance-indicators-table/performance-indicators-table.component';

@Component({
  selector: 'app-exam-result',
  imports: [TranslatePipe, NgClass, PerformanceIndicatorsTableComponent],
  templateUrl: './exam-result.component.html',
  styleUrl: './exam-result.component.scss'
})
export class ExamResultComponent {
  private shared=inject(Shared);
  private router=inject(Router);
  examResult: any;

  storageKey: string='';

  ngOnInit() {
    this.storageKey = `examResult-${this.shared.studentExamId()}`;
    const stored = localStorage.getItem(this.storageKey);
    this.examResult = stored ? JSON.parse(stored) : null;

    // remove from storage once loaded
    if (this.examResult) {
      localStorage.removeItem(this.storageKey);
    }

    // optional: redirect if no result
    if (!this.examResult) {
      this.router.navigateByUrl(`${this.shared.lang()}/home`);
    }
  }


  getScoreCategory(): string {
    const score = this.examResult?.obtainedScore ?? 0;

    if (score >= 150) {
      return 'aboveTarget';
    } else if (score >= 117) {
      return 'target';
    } else if (score >= 97) {
      return 'belowTarget';
    } else {
      return 'improvement';
    }
  }

  getScoreLabel(): string {
    const score = this.examResult?.obtainedScore ?? 0;

    if (score >= 150) {
      return 'Above Target';
    } else if (score >= 117) {
      return 'Target';
    } else if (score >= 97) {
      return 'Below Target';
    } else {
      return 'Needs Improvement';
    }
  }
}
