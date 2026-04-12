

import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { ClientExamQuestionComponent } from '../../client-exam-question/client-exam-question.component';
import { Shared } from '../../../../shared/Services/shared/shared';
import { QuestionsStore } from '../../../../AdminPanelStores/QuestionStores/questions.store';
import { Filter } from '../../../../models/rquest';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { NoQuestionComponent } from '../no-question/no-question.component';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { APIExam } from '../../../../models/certification';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-free-exam',
  imports: [ClientExamQuestionComponent, SiteButtonComponent, NgClass, NoQuestionComponent,
    GenericModelComponent, SpinnerComponent],
  templateUrl: './free-exam.component.html',
  styleUrl: './free-exam.component.scss',
  providers: [QuestionsStore],

})
export class FreeExamComponent {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private route = inject(ActivatedRoute)
  private auth=inject(AuthService);
  private isBrowser = isPlatformBrowser(this.platformId);
  questionStore = inject(QuestionsStore);
  private shared = inject(Shared);
  private toasting = inject(ToastingMessagesService);
  isRTL = this.shared.isRtl;
  showQuestionBoard: boolean = false;
  examChoiceAnswers: any[] = [];
  examMatchingAnswers: any[] = [];
  currentExamId = signal<string>('');
  saveForLater: boolean = false;
  currentQuestionIndex = signal<number>(0);
  currentMode = signal<string>('');
  resultState = signal({
    correct: 0,
    wrong: 0,
    answered: 0
  });
  isMarked = computed(() => {
    const question = this.currentQuestion();
    if (!question) return false;

    return this.markedQuestions().has(question.oid);
  });

  hasQuestions = computed(() => this.questions().length > 0);
  questions = computed(() => {
    const list = this.questionStore.questions() ?? [];
    return [...list].sort((a, b) => a.orderNo - b.orderNo);
  });

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

  answerResult = signal<Map<string, boolean>>(new Map());
  isInitializing = signal(true);
  viewState = computed(() => {
    if (this.isInitializing()) return 'loading';

    if (this.hasQuestions() && this.currentQuestion()) return 'ready';

    if (!this.hasQuestions()) return 'empty';

    if (!this.currentQuestion()) return 'invalid';

    return '';
  });

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      this.currentMode.set(params.get('mode') ?? '');
    });

    effect(() => {
      if (!this.questionStore.loading()) {
        this.isInitializing.set(false);
      }
    });

    effect(() => {
      const examId = this.shared.currentExamId();
      if (examId) {
        this.currentExamId.set(examId);
        this.isInitializing.set(true);
        const filters: Filter[] = [{
          propertyName: "coursesMasterExamOid",
          value: examId,
          operation: 0
        }];
        this.questionStore.setFilters([...filters]);
        this.questionStore.queryQuestions(this.questionStore.queryRequest());
        if (this.isBrowser) {
          const key = this.getStorageKey(examId);
          const saved = localStorage.getItem(key);
          if (!saved) { this.resetExam(); return; }
          const parsed = JSON.parse(saved);
          this.saveForLater = parsed.saveForLater;
          if (this.saveForLater) {
            this.currentQuestionIndex.set(parsed.currentQuestionIndex ?? 0);
            this.examChoiceAnswers = parsed.examChoiceAnswers ?? [];
            this.examMatchingAnswers = parsed.examMatchingAnswers ?? []
            if (parsed.markedQuestions) {
              this.markedQuestions.set(new Set(parsed.markedQuestions));
            }
            if (parsed.answeredQuestions) {
              this.answeredQuestions.set(new Set(parsed.answeredQuestions));
            }
            if (parsed.answerResult) {
              this.answerResult.set(new Map(parsed.answerResult));
            }
          }
          else {
            this.resetExam();
          }
        }
      }
    });
    effect(() => {
      if (this.questions().length > 0) {
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
      this.saveExamProgress();
    });
  }



  onSaveForLater() {
    this.saveForLater = true;
    this.saveExamProgress();
    if (this.isBrowser) {
      this.toasting.showToast('examToast.save.success', 'success');
    }
    this.router.navigate(['../../chooseExam'], {
      relativeTo: this.route,
    });
  }





  finishExam(end: boolean) {
    if (this.isBrowser) {
      const key = this.getStorageKey(this.currentExamId());
      localStorage.removeItem(key);
      if (this.currentMode() == 'Practice') {
        this.toasting.showToast('examToast.finish.success', 'success');
        this.router.navigate(['../../chooseExam'], {
          relativeTo: this.route,
        });
      }
      else {
        const result = this.calculcateExamModeResult();
        this.saveExamResult(result);
        const examResult = `examResult-freeEXam-${this.currentExamId()}`;
        localStorage.setItem(examResult, JSON.stringify(result));
        this.router.navigate(['../../exam-result'], {
          relativeTo: this.route,
        });
      }
    }

  }


  onForceEnd() {
    if (this.isBrowser) {

      const key = this.getStorageKey(this.currentExamId());
      localStorage.removeItem(key);
      if (this.currentMode() == 'Exam') {
        const result = this.calculcateExamModeResult();
        this.saveExamResult(result);
        const examResult = `examResult-freeEXam-${this.currentExamId()}`;
        localStorage.setItem(examResult, JSON.stringify(result));
        this.router.navigate(['../../exam-result'], {
          relativeTo: this.route,
        });
      } else {
        this.router.navigate(['../../exam-simulator'], {
          relativeTo: this.route,
        });
      }

    }
  }


  private saveExamResult(newResult: any) {
    if (!this.isBrowser) return;

    const userId = this.auth.loggedStudent()?.userId ?? null;
    const key = this.shared.getExamResultsKey(userId);
    if (!key) return;

    const existing = localStorage.getItem(key);

    let results: any[] = [];

    if (existing) {
      try {
        results = JSON.parse(existing);
      } catch {
        results = [];
      }
    }

    // ✅ Get attempts for same exam
    const sameExamAttempts = results.filter(
      r => r.coursesMasterExamOid === newResult.coursesMasterExamOid
    );

    // ✅ Calculate next attempt number
    const nextAttemptNo =
      sameExamAttempts.length > 0
        ? Math.max(...sameExamAttempts.map(a => a.attemptNo ?? 0)) + 1
        : 1;

    // ✅ Add attemptNo + date
    const resultWithAttempt = {
      ...newResult,
      attemptNo: nextAttemptNo,
      date: new Date().toISOString()
    };

    // ✅ Always push (DON’T overwrite)
    results.push(resultWithAttempt);

    localStorage.setItem(key, JSON.stringify(results));
  }

  calculcateExamModeResult() {
    const totalScore = this.questions().length;
    // const { correct } = this.resultState();
    const { correct, wrong, answered } = this.resultState();

    const obtainedScore = correct;

    const passPercent = 60;

    const percentage = totalScore > 0
      ? (obtainedScore / totalScore) * 100
      : 0;

    const isPassed = percentage >= passPercent;
    const notAnswered = totalScore - answered;

    return {
      coursesMasterExamOid: this.currentExamId(),
      examName: this.shared.currentExam()?.examName ?? '',
      totalScore,
      obtainedScore,
      passPercent,
      isPassed,
      date: new Date().toISOString(),
      mode: this.currentMode(),
      cleared: false,
      summary:{
        incorrect: wrong,
        notAnswered
      }


    };
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


  private getStorageKey(Id:string): string {
    if (!Id) return '';
    const exam=this.shared.currentExam();
    if(!exam) return '';
    const examId = Id;
    const mode = this.currentMode();
    const userId = this.auth.loggedStudent()?.userId;
    const hasToken = this.auth.studentToken();
    if (exam.freeExam) {
      return hasToken
        ? `exam-progress-freeExam-${userId}-${mode}-${examId}`
        : `exam-progress-freeExam-${mode}-${examId}`;
    }

    return `exam-progress-student_${userId}-${mode}-${examId}`;
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

    const isCorrect = studentAnswers.every((pair: any) => {

      const leftItem = question.answers.find(
        (a: any) => String(a.oid) === String(pair.selectedAnswerOid)
      );

      if (!leftItem) return false;

      return String(leftItem.correctAnswerOid) === String(pair.answerSelectedAnswerOid);

    });

    return isCorrect;
  }


  goToNext(newAnswer: any) {

    const q = this.currentQuestion();
    if (!q) return;

    if (newAnswer.type === 'empty') {
      this.updateIndex(newAnswer.last);
      return;
    }


    if (newAnswer.type === 'Multiple Choice Question') {

      const prev = this.examChoiceAnswers.find(
        x => x.questionOid === newAnswer.answers.questionOid
      );

      const prevCorrect = prev
        ? this.checkMultipleChoiceAnswer(q, prev.selectedAnswerOids)
        : null;

      const isCorrect = this.checkMultipleChoiceAnswer(
        q,
        newAnswer.answers.selectedAnswerOids
      );

      this.updateResult(q, isCorrect, prevCorrect);

      this.updateChoiceAnswer(newAnswer);

      if (q?.oid) {
        this.answeredQuestions.update(set => {
          const s = new Set(set);
          s.add(q.oid);
          return s;
        });
      }

      // if (this.currentMode() === 'Practice') {
      //   this.toasting.showToast(
      //     isCorrect ? 'examToast.finish.correctAnswer' : 'examToast.finish.wrongAnswer',
      //     isCorrect ? 'success' : 'error'
      //   );
      // }

      this.saveExamProgress();

      setTimeout(() => {
        this.updateIndex(newAnswer.last);
      }, 500);
    }


    else if (newAnswer.type === 'Matching') {

      const matchingAnswer = {
        questionOid: q.oid,
        answers: newAnswer.answers
      };

      const prev = this.examMatchingAnswers.find(
        x => x.questionOid === matchingAnswer.questionOid
      );

      const prevCorrect = prev
        ? this.checkMatchingAnswer(q, prev.answers)
        : null;

      const isCorrect = this.checkMatchingAnswer(
        q,
        newAnswer.answers
      );

      this.updateResult(q, isCorrect, prevCorrect);

      this.updateMatchingAnswer(matchingAnswer);

      if (q?.oid) {
        this.answeredQuestions.update(set => {
          const s = new Set(set);
          s.add(q.oid);
          return s;
        });
      }

      // if (this.currentMode() === 'Practice') {
      //   this.toasting.showToast(
      //     isCorrect ? 'examToast.finish.correctMatch' : 'examToast.finish.wrongMatch',
      //     isCorrect ? 'success' : 'error'
      //   );
      // }

      this.saveExamProgress();

      setTimeout(() => {
        this.updateIndex(newAnswer.last);
      }, 800);
    }
  }



  private updateResult(q: any, isCorrect: boolean, prevCorrect: boolean | null) {
    this.resultState.update(r => {
      let { correct, wrong, answered } = r;

      if (prevCorrect === null) {
        answered++;
        isCorrect ? correct++ : wrong++;
      }

      else {
        if (prevCorrect && !isCorrect) {
          correct--;
          wrong++;
        } else if (!prevCorrect && isCorrect) {
          wrong--;
          correct++;
        }
      }

      return { correct, wrong, answered };
    });
  }

  private saveExamProgress() {
    if (!this.isBrowser) return;

    const key = this.getStorageKey(this.currentExamId());

    if(!key) return;
    localStorage.setItem(
      key,
      JSON.stringify({
        saveForLater: this.saveForLater,
        exam: this.shared.currentExam(),
        examMode: this.currentMode(),
        currentQuestionIndex: this.currentQuestionIndex(),
        examChoiceAnswers: this.examChoiceAnswers,
        examMatchingAnswers: this.examMatchingAnswers,
        markedQuestions: Array.from(this.markedQuestions()),
        answeredQuestions: Array.from(this.answeredQuestions()),
        answerResult: Array.from(this.answerResult().entries())
      })
    );
  }



  goToPrevious() {
    if (this.currentQuestionIndex() <= 0) return;

    this.currentQuestionIndex.update(i => i - 1);

    const question = this.currentQuestion();
    if (!question) return;

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

    else if (question.questionTypeName === 'Matching') {

      const saved = this.examMatchingAnswers.find(
        x => x.questionOid === question.oid
      );

      if (saved) {
        question.savedMatchingAnswers = saved.answers;
      }

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
        this.toasting.showToast('question.mark.remove', 'info');
      } else {
        newMarks.add(oid);
        this.toasting.showToast('question.mark.add', 'success');
      }

      return newMarks;
    });

    this.saveExamProgress();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    const key = this.getStorageKey(this.currentExamId());
    if (key && !this.saveForLater)
      localStorage.removeItem(key);
  }
}
