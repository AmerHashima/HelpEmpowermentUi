// src\app\components\ClientSide\certifications\simulator-exams\simulator-exams.component.ts
import { Component, computed, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ExamsStore } from '../../../../AdminPanelStores/ExamsStore/exam.store';
import { isPlatformBrowser } from '@angular/common';
import { APIExam } from '../../../../models/certification';

@Component({
  selector: 'app-simulator-exams',
  imports: [TranslateModule, TranslatePipe, SiteButtonComponent],
  templateUrl: './simulator-exams.component.html',
  styleUrl: './simulator-exams.component.scss',
})
export class SimulatorExamsComponent {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;
  items=input<any>();



  startExam(item: any) {
    const examId = item.oid;
    this.shared.currentExam.set(item);
    this.shared.currentExamId.set(`${examId}`);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentExamId', examId);
      localStorage.setItem('currentExam', JSON.stringify(item));
    }
    this.router.navigate(['../chooseExam'], {
      relativeTo: this.route
    });
  }
}



