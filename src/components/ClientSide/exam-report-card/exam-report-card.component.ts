import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Shared } from '../../../app/shared/Services/shared/shared';
import { SiteButtonComponent } from '../../../app/shared/clientSide/site-button/site-button.component';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';


export interface ExamReport {
  title: number;
  date: string;
  duration: number;
  correct: number;
  incorrect: number;
  obtainedScore:number;
  notAnswered: number;
  isPassed: boolean;
}


@Component({
  selector: 'app-exam-report-card',
  standalone: true,
  imports: [
    CommonModule, SiteButtonComponent,TranslatePipe,DatePipe ],
  templateUrl: './exam-report-card.component.html',
  styleUrl: './exam-report-card.component.scss'
})
export class ExamReportCardComponent {
  private router=inject(Router);
  private shared = inject(Shared);
  isRTL=this.shared.isRtl;
  report = input.required<ExamReport>();
  level = computed(() => this.shared.getScoreCategory(this.report().obtainedScore))
  levelLabel = computed(() => this.shared.getScoreLabel(this.report().obtainedScore))
  levelIconMap: Record<string, string> = {
    aboveTarget: 'bi-trophy',
    target: 'bi-check-circle',
    belowTarget: 'bi-exclamation-circle',
    improvement: 'bi-arrow-up-circle'
  };
  levelIcon = computed(() => this.levelIconMap[this.level()]);
  // viewLessons = output<void>();
  performanceIndicators(){
    this.router.navigateByUrl(`/${this.shared.lang()}/performance-levels`);
  }


}
