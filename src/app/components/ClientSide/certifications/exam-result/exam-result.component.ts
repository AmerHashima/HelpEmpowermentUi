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

  scoreCategory = computed(() =>
  {
    console.log('in caregory');
    return this.shared.getScoreCategory(this.score())
  }
  );

  scoreLabel = computed(() =>
   {
    console.log('in label');

    return this.shared.getScoreLabel(this.score())
   }
  );
  ngOnInit() {
    const isBrowser = isPlatformBrowser(this.platformId);

    if (!isBrowser) return;

    this.storageKey = `examResult-${this.shared.studentExamId()}`;
    const stored = localStorage.getItem(this.storageKey);
    this.examResult.set(stored ? JSON.parse(stored) : null)

    if (this.examResult()) {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem('studentExamId');
    }

    if (!this.examResult()) {
      this.router.navigateByUrl(`${this.shared.lang()}/home`);
    }
  }

  Done(){
    // this.router.navigate(['../exam-simulator'], {

    this.router.navigate(['../chooseExam'], {
      relativeTo: this.route,
    });
  }
}
