import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ExamsStore } from '../../../../AdminPanelStores/ExamsStore/exam.store';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-simulator-exams',
  imports: [TranslateModule,TranslatePipe,SiteButtonComponent],
  templateUrl: './simulator-exams.component.html',
  styleUrl: './simulator-exams.component.scss',
  providers: [ExamsStore]
})
export class SimulatorExamsComponent {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);
  private shared = inject(Shared);
  private examsStore = inject(ExamsStore);
  isRTL = this.shared.isRtl;


  items = computed(() => {
    const exams = this.examsStore.exams();
    if (!exams?.length) return [];
    return exams;
  });

  // startIndex = 0;
  startIndex = signal(0);

  visibleCount = 3;




  visibleItems = computed(() => {
    const all = this.items();
    const start = this.startIndex();
    return all.slice(start, start + this.visibleCount);
  });

  canGoPrev = computed(() => this.startIndex() > 0);

  canGoNext = computed(() => {
    return this.startIndex() + this.visibleCount < this.items().length;
  });

  prev() {
    if (this.canGoPrev()) {
      this.startIndex.update(v => v - this.visibleCount);
    }
  }

  next() {
    if (this.canGoNext()) {
      this.startIndex.update(v => v + this.visibleCount);
    }
  }
  startExam(item: any) {
    const examId=item.oid;
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



