import { Component, inject } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-simulator-exams',
  imports: [TranslateModule,TranslatePipe,SiteButtonComponent],
  templateUrl: './simulator-exams.component.html',
  styleUrl: './simulator-exams.component.scss'
})
export class SimulatorExamsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;

  // Generate 9 exams (1 to 9)
  items = Array.from({ length: 9 }, (_, i) => i + 1);

  startIndex = 0;
  visibleCount = 3;

  get visibleItems() {
    return this.items.slice(this.startIndex, this.startIndex + this.visibleCount);
  }

  get canGoPrev(): boolean {
    return this.startIndex > 0;
  }

  get canGoNext(): boolean {
    return this.startIndex + this.visibleCount < this.items.length;
  }

  prev() {
    if (this.canGoPrev) {
      this.startIndex -= this.visibleCount;
    }
  }

  next() {
    if (this.canGoNext) {
      this.startIndex += this.visibleCount;
    }
  }

  startExam(examId: number) {
    this.shared.currentExamId.set(`${examId}`);
    this.router.navigate(['../chooseExam'], {
      relativeTo: this.route
    });
  }
}
