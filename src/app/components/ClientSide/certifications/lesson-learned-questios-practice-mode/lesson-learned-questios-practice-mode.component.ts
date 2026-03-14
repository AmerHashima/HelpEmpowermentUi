import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { ClientExamQuestionComponent } from '../../client-exam-question/client-exam-question.component';
import { Shared } from '../../../../shared/Services/shared/shared';
import { QuestionsStore } from '../../../../AdminPanelStores/QuestionStores/questions.store';
import { Filter } from '../../../../models/rquest';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { AuthService } from '../../../../Services/auth.service';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';

@Component({
  selector: 'app-lesson-learned-questios-practice-mode',
  imports: [ClientExamQuestionComponent, SiteButtonComponent, NgClass, GenericModelComponent],
  templateUrl: './lesson-learned-questios-practice-mode.component.html',
  styleUrl: './lesson-learned-questios-practice-mode.component.scss',
  providers: [QuestionsStore],
  standalone:true
})
export class LessonLearnedQUestiosPracticeModeComponent {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private route = inject(ActivatedRoute)
  private isBrowser = isPlatformBrowser(this.platformId);
  private questionStore = inject(QuestionsStore);
  private shared = inject(Shared);
  private toasting = inject(ToastingMessagesService);
  isRTL = this.shared.isRtl;
  private auth = inject(AuthService)
  showQuestionBoard: boolean = false;
  examChoiceAnswers: any[] = [];
  examMatchingAnswers: any[] = [];
  saveForLater: boolean = false;
  currentQuestionIndex = signal<number>(0);

  currentType = signal<string>('');

  studentExamId = signal<string>('');
  isMarked = computed(() => {
    const question = this.currentQuestion();
    if (!question) return false;

    return this.markedQuestions().has(question.oid);
  });
  isAnswerLocked = computed(() => {
    const q = this.currentQuestion();
    if (!q) return false;

    return (
      this.revealedQuestions().has(q.oid)
    );
  });
  questions = computed(() => {
    const list = this.questionStore.questions() ?? [];
    return [...list].sort((a, b) => a.orderNo - b.orderNo);
  });

  revealedQuestions = signal<Set<string>>(new Set());
  answeredBeforeReveal = signal<Set<string>>(new Set());
  answeredQuestions = signal<Set<string>>(new Set());
  boardQuestions = computed(() => {
    const list = this.questionStore.questions() ?? [];
    const marked = this.markedQuestions();
    const answered = this.answeredQuestions();

    return [...list]
      .sort((a, b) => a.orderNo - b.orderNo)
      .map((q, i) => {
        const isMarked = marked.has(q.oid!);
        const isAnswered = answered.has(q.oid!);

        let status = 'notVisited';
        if (isMarked && isAnswered) {
          status = 'marked-answered';
        } else if (isMarked) {
          status = 'marked';
        } else if (isAnswered) {
          status = 'answered';
        }

        return {
          ...q,
          status
        };
      });
  });

  currentQuestion = computed(() => {
    const qs = this.questions();
    const idx = this.currentQuestionIndex();
    if (qs.length === 0 || idx < 0 || idx >= qs.length) return null;
    return this.mapToClientQuestion(qs[idx], idx);
  });

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      this.currentType.set(params.get('type') ?? '');
      this.studentExamId.set(params.get('examId') ?? '');
    });

    effect(() => {
      const practiceType = this.currentType();
      const studentExamId = this.studentExamId();
      let lookupId=null;
      if (practiceType && studentExamId) {
        console.log('in lesson learned exam qyestions')

        if(practiceType == 'Correct')
          lookupId ="44444444-4444-4444-4444-444444444401";
        else if(practiceType == 'Incorrect')
        lookupId = "44444444-4444-4444-4444-444444444402";
else lookupId = "44444444-4444-4444-4444-444444444403";

        const filters: Filter[] = [{
          propertyName: "questionStatusLookupId",
          value: lookupId,
          operation: 0
        },
          {
            propertyName: "studentExamOid",
            value: studentExamId,
            operation: 0
          },

      ];
        this.questionStore.setFilters([...filters]);
        this.questionStore.queryStudentExamQuestions(this.questionStore.queryRequest());
        if (this.isBrowser) {
          const key = this.getStorageKey(studentExamId);
          const saved = localStorage.getItem(key);
          if (!saved) { this.resetExam(); return; }
          const parsed = JSON.parse(saved);
          this.saveForLater = parsed.saveForLater;
            this.currentQuestionIndex.set(parsed.currentQuestionIndex ?? 0);
            this.examChoiceAnswers = parsed.examChoiceAnswers ?? [];
            this.examMatchingAnswers = parsed.examMatchingAnswers ?? []
            if (parsed.markedQuestions) {
              this.markedQuestions.set(new Set(parsed.markedQuestions));
            }
            if (parsed.answeredBeforeReveal) {
              this.answeredBeforeReveal.set(new Set(parsed.answeredBeforeReveal));
            }
            if (parsed.revealedQuestions) {
              this.revealedQuestions.set(new Set(parsed.revealedQuestions));
            }
            if (parsed.answeredQuestions) {
              this.answeredQuestions.set(new Set(parsed.answeredQuestions));
            }

        }
      }
    });


    effect(() => {
      if (this.questions().length > 0) {
        console.log('questions',this.questions())
        if (this.currentQuestionIndex() >= this.questions().length) {
          this.currentQuestionIndex.set(0);
        }
      }
    });

    effect(() => {
      if (!this.isBrowser) return;

      const examId = this.studentExamId();
      const index = this.currentQuestionIndex();

      if (!examId) return;
      this.saveExamProgress();
    });
  }

  onSaveForLater() {
    this.saveForLater = true;
    this.saveExamProgress();
    if (this.isBrowser) {
      this.toasting.showToast('Exam has been saved for later', 'success');
    }

    this.router.navigate(['../../chooseExam'], {
      relativeTo: this.route,
    });
  }

  onRevealAnswer(questionId: string) {

    const currentAnswer = this.examChoiceAnswers.find(
      x => x.questionOid === questionId
    );

    if (currentAnswer?.selectedAnswerOids?.length) {
      this.answeredBeforeReveal.update(set => {
        const s = new Set(set);
        s.add(questionId);
        return s;
      });
    }

    this.revealedQuestions.update(set => {
      const s = new Set(set);
      s.add(questionId);
      return s;
    });
  }

  finishExam(end: boolean) {
    console.log('finish practicing');
    if (this.isBrowser) {
      this.toasting.showToast('Finish Practicing', 'success');
    }
    this.router.navigate(['../../chooseExam'], {
      relativeTo: this.route,
    });
    // const payload: submitStudentExam = {
    //   studentExamOid: this.shared.studentExamId(),
    //   answers: [],
    //   updatedBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    // }

    // if (end && this.isBrowser) {
    //   this.studentExamService.submitExam(payload).subscribe({
    //     next: (result) => {
    //       const key = this.getStorageKey(this.currentExamId());
    //       localStorage.removeItem(key);
    //       localStorage.removeItem('currentExam');
    //       localStorage.removeItem('currentExamId');
    //       const examResult = `examResult-${this.shared.studentExamId()}`;
    //       localStorage.setItem(examResult, JSON.stringify(result));
    //       this.router.navigate(['../../exam-result'], {
    //         relativeTo: this.route,
    //       });
    //     }
    //   })

    // }
  }

  resetExam() {
    this.currentQuestionIndex.set(0);
    this.examChoiceAnswers = [];
    this.examMatchingAnswers = [];
    this.markedQuestions.set(new Set([]));
    this.answeredQuestions.set(new Set([]));

  }
  onOpenQuestionBoard(show: boolean) {
    this.showQuestionBoard = true
  }
  closeQuestionBoard() {
    this.showQuestionBoard = false;
  }
  navigateToQuestion(q: number) {
    this.goToQuestionNumber(q)
    this.showQuestionBoard = false;
  }


  private mapToClientQuestion(q: any, index: number): any {

    const savedChoice = this.examChoiceAnswers.find(
      x => x.questionOid === q.oid
    );

    const savedMatching = this.examMatchingAnswers.find(
      x => x.questionOid === q.oid
    );

    return {
      ...q,
      answers: (q.answers || []).map((opt: any, i: number) => ({
        ...opt,
        letter: String.fromCharCode(65 + i),
        isSelected: savedChoice
          ? savedChoice.selectedAnswerOids.includes(opt.oid)
          : false
      })),
      savedMatchingAnswers: savedMatching?.answers ?? [],
      progress: Math.round(((q.orderNo!) / Math.max(1, this.questions().length)) * 100),
      totalQuestions: this.questions().length,
      maxChoices: q.answers.filter((o: any) => o.isCorrect).length || 1
    };
  }

  private getStorageKey(examId: string) {
    return `exam-progress-lesson-learned-type-${this.currentType()}-student_${this.auth.loggedStudent()?.userId}-studentExamId-${examId}`;
  }



  updateIndex(last: boolean = false) {
    if (!last) {
      if (this.currentQuestionIndex() < this.questions().length - 1) {
        this.currentQuestionIndex.update(i => i + 1);
      }
    } else this.finishExam(true)

  }


  updateChoiceAnswer(newAnswer: any) {
    if (this.examChoiceAnswers.length == 0) {
      this.examChoiceAnswers.push(newAnswer.answers);
      return;
    }

    const index = this.examChoiceAnswers.findIndex(
      x => x.questionOid == newAnswer.answers.questionOid
    );
    if (index > -1) {
      this.examChoiceAnswers[index] = newAnswer.answers;
    } else {
      this.examChoiceAnswers.push(newAnswer.answers);
    }
    this.saveExamProgress()
  }
  updateMatchingAnswer(matchingPayload: any) {
    if (this.examMatchingAnswers.length == 0) {
      this.examMatchingAnswers.push(matchingPayload);
      return;
    }
    const index = this.examMatchingAnswers.findIndex(
      x => x.questionOid == matchingPayload.questionOid
    );
    if (index > -1) {
      this.examMatchingAnswers[index] = matchingPayload;
    } else {
      this.examMatchingAnswers.push(matchingPayload);
    }
    this.saveExamProgress()
  }


  checkMultipleChoiceAnswer(question: any, selectedAnswerOids: string[]): boolean {

    const correctAnswers = question.answers
      .filter((a: any) => a.isCorrect)
      .map((a: any) => a.oid)
      .sort();

    const studentAnswers = [...selectedAnswerOids].sort();

    return JSON.stringify(correctAnswers) === JSON.stringify(studentAnswers);
  }

  checkMatchingAnswer(question: any, studentAnswers: any[]): boolean {

    if (!studentAnswers || studentAnswers.length === 0) return false;

    return studentAnswers.every((pair: any) => {

      const leftItem = question.answers.find(
        (a: any) => a.oid === pair.leftOid
      );

      if (!leftItem) return false;

      return leftItem.correctAnswerOid === pair.rightOid;

    });

  }

  goToNext(newAnswer: any) {

    const q = this.currentQuestion();
    if (!q) return;

    // If answer revealed and user didn't answer before reveal → ignore answer
    if (this.revealedQuestions().has(q.oid) && !this.answeredBeforeReveal().has(q.oid)) {
      newAnswer = { type: 'empty' };
    }

    if (newAnswer.type === 'empty') {
      this.updateIndex(newAnswer.last);
      return;
    }

    // =========================
    // MULTIPLE CHOICE QUESTION
    // =========================
    if (newAnswer.type === 'Multiple Choice Question') {

      const existing = this.examChoiceAnswers.find(
        x => x.questionOid === newAnswer.answers.questionOid
      );

      if (
        existing &&
        JSON.stringify(existing.selectedAnswerOids) ===
        JSON.stringify(newAnswer.answers.selectedAnswerOids)
      ) {
        this.updateIndex(newAnswer.last);
        return;
      }

      const correctAnswers = q.answers
        .filter((a: any) => a.isCorrect)
        .map((a: any) => a.oid)
        .sort();

      const studentAnswers = [...newAnswer.answers.selectedAnswerOids].sort();

      const isCorrect =
        JSON.stringify(correctAnswers) === JSON.stringify(studentAnswers);

      if (isCorrect) {
        this.toasting.showToast('Correct Answer ✅', 'success');
      } else {
        this.toasting.showToast('Wrong Answer ❌', 'error');
      }

      this.updateChoiceAnswer(newAnswer);

      if (q?.oid) {
        this.answeredQuestions.update(set => {
          const s = new Set(set);
          s.add(q.oid);
          return s;
        });
      }

      this.saveExamProgress();

      setTimeout(() => {
        this.updateIndex(newAnswer.last);
      }, 800);
    }

    // =========================
    // MATCHING QUESTION
    // =========================
    else if (newAnswer.type === 'Matching') {

      const matchingAnswer = {
        questionOid: q.oid,
        answers: newAnswer.answers
      };

      const existing = this.examMatchingAnswers.find(
        x => x.questionOid === matchingAnswer.questionOid
      );

      if (
        existing &&
        JSON.stringify(existing.answers) === JSON.stringify(matchingAnswer.answers)
      ) {
        this.updateIndex(newAnswer.last);
        return;
      }

      const isCorrect = newAnswer.answers.every((pair: any) => {

        const leftItem = q.answers.find(
          (a: any) => a.oid === pair.leftOid
        );

        if (!leftItem) return false;

        return leftItem.correctAnswerOid === pair.rightOid;

      });

      if (isCorrect) {
        this.toasting.showToast('Correct Match ✅', 'success');
      } else {
        this.toasting.showToast('Wrong Match ❌', 'error');
      }

      this.updateMatchingAnswer(matchingAnswer);

      if (q?.oid) {
        this.answeredQuestions.update(set => {
          const s = new Set(set);
          s.add(q.oid);
          return s;
        });
      }

      this.saveExamProgress();

      setTimeout(() => {
        this.updateIndex(newAnswer.last);
      }, 800);
    }
  }

  private saveExamProgress() {
    if (!this.isBrowser) return;

    const key = this.getStorageKey(this.studentExamId());

    localStorage.setItem(
      key,
      JSON.stringify({
        saveForLater: this.saveForLater,
        type: this.currentType(),
        exam: this.shared.currentExam(),
        studentId: this.auth.loggedStudent()?.userId,
        studentExamId: this.shared.studentExamId(),
        currentQuestionIndex: this.currentQuestionIndex(),
        examChoiceAnswers: this.examChoiceAnswers,
        examMatchingAnswers: this.examMatchingAnswers,
        revealedQuestions: Array.from(this.revealedQuestions()),
        answeredBeforeReveal: Array.from(this.answeredBeforeReveal()),
        markedQuestions: Array.from(this.markedQuestions()),
        answeredQuestions: Array.from(this.answeredQuestions())
      })
    );
  }



  goToPrevious() {
    if (this.currentQuestionIndex() <= 0) return;

    this.currentQuestionIndex.update(i => i - 1);

    const question = this.currentQuestion();
    if (!question) return;

    // Restore Multiple Choice
    if (question.questionTypeName === 'Multiple Choice Question') {

      const saved = this.examChoiceAnswers.find(
        x => x.questionOid === question.oid
      );

      if (saved) {
        question.answers.forEach((a: any) => {
          a.isSelected = saved.selectedAnswerOids.includes(a.oid);
        });
      }

    }

    // Restore Matching
    else if (question.questionTypeName === 'Matching') {

      const saved = this.examMatchingAnswers.find(
        x => x.questionOid === question.oid
      );

      if (saved) {
        question.savedMatchingAnswers = saved.answers;
      }

    }

    // 🔒 Enforce reveal rule AFTER restore
    if (
      this.revealedQuestions().has(question.oid) &&
      !this.answeredBeforeReveal().has(question.oid)
    ) {
      question.answers?.forEach((a: any) => a.isSelected = false);
    }
  }

  goToQuestionNumber(num: number) {
    const index = num;
    if (index >= 0 && index < this.questions().length) {
      this.currentQuestionIndex.set(index);
    }
  }


  markedQuestions = signal<Set<string>>(new Set());



  onMarkQuestion(wantMark: boolean) {
    const question = this.currentQuestion();
    if (!question) return;

    const oid = question.oid;

    this.markedQuestions.update(marks => {
      const newMarks = new Set(marks);

      if (newMarks.has(oid)) {
        newMarks.delete(oid);
        this.toasting.showToast('Mark removed', 'info');
      } else {
        newMarks.add(oid);
        this.toasting.showToast('Question marked successfully', 'success');
      }

      return newMarks;
    });

    this.saveExamProgress();
  }
}
