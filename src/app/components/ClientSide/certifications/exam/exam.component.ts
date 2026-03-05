import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { ClientExamQuestionComponent } from '../../client-exam-question/client-exam-question.component';
import { Shared } from '../../../../shared/Services/shared/shared';
import { QuestionsStore } from '../../../../AdminPanelStores/QuestionStores/questions.store';
import { Filter } from '../../../../models/rquest';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-exam',
  imports: [ClientExamQuestionComponent],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.scss',
  providers: [QuestionsStore],
  standalone: true
})
export class ExamComponent {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private questionStore = inject(QuestionsStore);
  private shared = inject(Shared);
  examAnswers=[];
  currentExamId = signal<string>('');
  currentQuestionIndex = signal<number>(0);

  questions = computed(() => {
    const list = this.questionStore.questions() ?? [];
    return [...list].sort((a, b) => a.orderNo - b.orderNo);
  });

  // Derived current question (safe access)
  currentQuestion = computed(() => {
    const qs = this.questions();
    const idx = this.currentQuestionIndex();
    if (qs.length === 0 || idx < 0 || idx >= qs.length) return null;
    return this.mapToClientQuestion(qs[idx], idx);
  });

  constructor() {
    // Load questions when exam id changes
    effect(() => {
      const examId = this.shared.currentExamId();
      this.currentExamId.set(examId);
      if (examId) {
        const filters: Filter[] = [{
          propertyName: "coursesMasterExamOid",
          value: examId,
          operation: 0 // assuming 0 = equals
        }];
        this.questionStore.setFilters([...filters]);
        this.questionStore.queryQuestions(this.questionStore.queryRequest());
        if (this.isBrowser) {
          const key = this.getStorageKey(examId);
          const saved = localStorage.getItem(key);

          if (saved) {
            const parsed = JSON.parse(saved);
            this.currentQuestionIndex.set(parsed.currentQuestionIndex ?? 0);
          }
        }
      }
    });

    // Optional: reset index when questions load / change
    effect(() => {
      if (this.questions().length > 0) {
        // only reset if index is invalid
        if (this.currentQuestionIndex() >= this.questions().length) {
          this.currentQuestionIndex.set(0);
        }
      }
    });

    effect(() => {
      if (!this.isBrowser) return;

      const examId = this.currentExamId();
      const index = this.currentQuestionIndex();

      if (!examId) return;

      const key = this.getStorageKey(examId);

      localStorage.setItem(
        key,
        JSON.stringify({
          currentQuestionIndex: index
        })
      );
    });
  }
  finishExam(end:boolean) {
    if(end && this.isBrowser){
      const key = this.getStorageKey(this.currentExamId());
      localStorage.removeItem(key);
    }
  }
  // Convert your backend question shape → frontend Question shape
  private mapToClientQuestion(q: any, index: number): any {
    console.log('orderNo', q.orderNo!)
    return {
      // oid: q.oid || `Q${index + 1}`,
      // text: q.questionText || '',
      // type: q.questionTypeName,
      // options: (q.answers || []).map((opt: any, i: number) => ({
      //   letter: String.fromCharCode(65 + i),
      //   text: opt.answerText,
      //   isSelected: false
      // })),
      ...q,
      answers: (q.answers || []).map((opt: any, i: number) => ({
        ...opt,
        letter: String.fromCharCode(65 + i),
        isSelected: false
      })),
      progress: Math.round(((q.orderNo!) / Math.max(1, this.questions().length)) * 100),
      // questionNumber: q.orderNo,
      totalQuestions: this.questions().length,
      maxChoices: q.answers.filter((o: any) => o.isCorrect).length || 1
    };
  }

  private getStorageKey(examId: string) {
    return `exam-progress-${examId}`;
  }

  // Navigation methods — to be called from child
  goToNext() {
    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
    }
  }

  goToPrevious() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(i => i - 1);
    }
  }

  goToQuestionNumber(num: number) {
    const index = num - 1;
    if (index >= 0 && index < this.questions().length) {
      this.currentQuestionIndex.set(index);
    }
  }

  onMarkQuestion(wantMarked: boolean) {

  }
  // markedQuestions = signal<Set<number>>(new Set());   // using Set for simplicity

  // // Helper: is current question marked?
  // isCurrentMarked = computed(() => {
  //   return this.markedQuestions().has(this.currentQuestionIndex());
  // });

  // // ─── Add this method ─────────────────────────────────────
  // onMarkQuestion(wantMarked: boolean) {
  //   const idx = this.currentQuestionIndex();

  //   this.markedQuestions.update(marks => {
  //     const newMarks = new Set(marks);
  //     if (wantMarked) {
  //       newMarks.add(idx);
  //     } else {
  //       newMarks.delete(idx);
  //     }
  //     return newMarks;
  //   });

  //   console.log(`Question ${idx + 1} ${wantMarked ? 'marked' : 'unmarked'}`);
  // }

  // // Optional: expose count for question board header
  // markedCount = computed(() => this.markedQuestions().size);
}
