import { Component, computed, inject, signal } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ExamsStore } from '../../../../AdminPanelStores/ExamsStore/exam.store';

@Component({
  selector: 'app-simulator-exams',
  imports: [TranslateModule,TranslatePipe,SiteButtonComponent],
  templateUrl: './simulator-exams.component.html',
  styleUrl: './simulator-exams.component.scss',
  providers: [ExamsStore]
})
export class SimulatorExamsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private shared = inject(Shared);
  private examsStore = inject(ExamsStore);
  isRTL = this.shared.isRtl;

  // Generate 9 exams (1 to 9)
  // items = Array.from({ length: 9 }, (_, i) => i + 1);
  items = computed(() => {
    const exams = this.examsStore.exams();
    if (!exams?.length) return [];
    return exams;
  });

  // startIndex = 0;
  startIndex = signal(0);

  visibleCount = 3;


  // get visibleItems() {
  //   return this.items.slice(this.startIndex, this.startIndex + this.visibleCount);
  // }

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

  // get canGoPrev(): boolean {
  //   return this.startIndex() > 0;
  // }

  // get canGoNext(): boolean {
  //   return this.startIndex + this.visibleCount < this.items.length;
  // }

  // prev() {
  //   if (this.canGoPrev) {
  //     this.startIndex -= this.visibleCount;
  //   }
  // }

  // next() {
  //   if (this.canGoNext) {
  //     this.startIndex += this.visibleCount;
  //   }
  // }

  startExam(examId: string) {
    this.shared.currentExamId.set(`${examId}`);
    this.router.navigate(['../chooseExam'], {
      relativeTo: this.route
    });
  }
}
