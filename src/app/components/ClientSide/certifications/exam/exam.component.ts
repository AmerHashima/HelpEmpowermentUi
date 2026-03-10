import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { ClientExamQuestionComponent } from '../../client-exam-question/client-exam-question.component';
import { Shared } from '../../../../shared/Services/shared/shared';
import { QuestionsStore } from '../../../../AdminPanelStores/QuestionStores/questions.store';
import { Filter } from '../../../../models/rquest';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { AuthService } from '../../../../Services/auth.service';
import { StudentExamService } from '../../../../Services/student-exam.service';
import { choiceQuestionExamSubmit, courseExam, submitStudentExam } from '../../../../models/certification';
import { SiteButtonComponent } from '../../../../shared/clientSide/site-button/site-button.component';
import { GenericModelComponent } from '../../../../shared/generic-model/generic-model.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';


@Component({
  selector: 'app-exam',
  imports: [ClientExamQuestionComponent, SiteButtonComponent, NgClass, GenericModelComponent],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.scss',
  providers: [QuestionsStore],
  standalone: true
})
export class ExamComponent {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private route = inject(ActivatedRoute)
  private studentExamService = inject(StudentExamService);
  private isBrowser = isPlatformBrowser(this.platformId);
  private questionStore = inject(QuestionsStore);
  private shared = inject(Shared);
  private toasting = inject(ToastingMessagesService);
  isRTL = this.shared.isRtl;
  private auth = inject(AuthService)
  showQuestionBoard: boolean = false;
  examChoiceAnswers: any[] = [];
  examMatchingAnswers: any[] = [];
  currentExamId = signal<string>('');
  saveForLater: boolean = false;
  currentQuestionIndex = signal<number>(0);
  currentMode = signal<string>('');

  isMarked = computed(() => {
    const question = this.currentQuestion();
    if (!question) return false;

    return this.markedQuestions().has(question.oid);
  });
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

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      this.currentMode.set(params.get('mode') ?? '');
    });

    // effect(() => {
    //   const examId = this.shared.currentExamId();
    //   this.currentExamId.set(examId);
    //   if (examId) {
    //     const filters: Filter[] = [{
    //       propertyName: "coursesMasterExamOid",
    //       value: examId,
    //       operation: 0
    //     }];
    //     this.questionStore.setFilters([...filters]);
    //     this.questionStore.queryQuestions(this.questionStore.queryRequest());
    //     if (this.isBrowser) {
    //       const key = this.getStorageKey(examId);
    //       const saved = localStorage.getItem(key);
    //       if (saved) {
    //         const parsed = JSON.parse(saved);
    //         this.currentQuestionIndex.set(parsed.currentQuestionIndex ?? 0);
    //         this.examChoiceAnswers = parsed.examChoiceAnswers ?? [];
    //         this.examMatchingAnswers = parsed.examMatchingAnswers ?? []
    //         if (parsed.markedQuestions) {
    //           this.markedQuestions.set(new Set(parsed.markedQuestions));
    //         }
    //         if (parsed.answeredQuestions) {
    //           this.answeredQuestions.set(new Set(parsed.answeredQuestions));
    //         }
    //       } else {
    //         this.currentQuestionIndex.set(0);
    //         this.examChoiceAnswers = [];
    //         this.examMatchingAnswers=[];
    //         this.markedQuestions.set(new Set([]));
    //         this.answeredQuestions.set(new Set([]));

    //       }
    //     }
    //   }
    // });
    effect(() => {
      const examId = this.shared.currentExamId();
      this.currentExamId.set(examId);
      if (examId) {
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
          if (parsed.examMode = 'Exam') {
            this.currentQuestionIndex.set(parsed.currentQuestionIndex ?? 0);
            this.examChoiceAnswers = parsed.examChoiceAnswers ?? [];
            this.examMatchingAnswers = parsed.examMatchingAnswers ?? []
            if (parsed.markedQuestions) {
              this.markedQuestions.set(new Set(parsed.markedQuestions));
            }
            if (parsed.answeredQuestions) {
              this.answeredQuestions.set(new Set(parsed.answeredQuestions));
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
      localStorage.removeItem('currentExam');
      localStorage.removeItem('currentExamId');
      localStorage.removeItem('studentExamId');
      this.toasting.showToast('Exam has been saved for later', 'success');
    }

    this.router.navigate(['../../exam-simulator'], {
      relativeTo: this.route,
    });
  }

  finishExam(end: boolean) {
    console.log('studentExamId', this.shared.studentExamId());
    const payload: submitStudentExam = {
      studentExamOid: this.shared.studentExamId(),
      answers: [],
      updatedBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    }

    if (end && this.isBrowser) {
      this.studentExamService.submitExam(payload).subscribe({
        next: (result) => {
          const key = this.getStorageKey(this.currentExamId());
          localStorage.removeItem(key);
          localStorage.removeItem('currentExam');
          localStorage.removeItem('currentExamId');
          const examResult = `examResult-${this.shared.studentExamId()}`;
          localStorage.setItem(examResult, JSON.stringify(result));
          this.router.navigate(['../../exam-result'], {
            relativeTo: this.route,
          });
        }
      })

    }
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
    return `exam-progress-student_${this.auth.loggedStudent()?.userId}-${this.currentMode()}-${examId}`;
  }



  goToNext(newAnswer: any) {

    if (newAnswer.type === 'empty') {
      this.updateIndex();
      return;
    }

    if (newAnswer.type === 'Multiple Choice Question') {

      const existing = this.examChoiceAnswers.find(
        x => x.questionOid === newAnswer.answers.questionOid
      );

      if (existing &&
        JSON.stringify(existing.selectedAnswerOids) ===
        JSON.stringify(newAnswer.answers.selectedAnswerOids)) {
        this.updateIndex();
        return;
      }

      this.studentExamService
        .submitchoiceExamQuestion(this.createChoicePayload(newAnswer.answers))
        .subscribe({
          next: () => {
            this.updateChoiceAnswer(newAnswer);
            const q = this.currentQuestion();

            if (q?.oid) {
              this.answeredQuestions.update(set => {
                const s = new Set(set);
                s.add(q.oid);
                return s;
              })
            }

            this.saveExamProgress();
            this.updateIndex();
          }
        });
    }

    else if (newAnswer.type === 'Matching') {

      const matchingPayload = this.createMatchingPayload(newAnswer.answers);

      const existing = this.examMatchingAnswers.find(
        x => x.questionOid === matchingPayload.questionOid
      );

      if (existing &&
        JSON.stringify(existing.answers) === JSON.stringify(matchingPayload.answers)) {
        this.updateIndex();
        return;
      }

      this.studentExamService
        .submitMatchingExamQuestion(matchingPayload)
        .subscribe({
          next: () => {
            this.updateMatchingAnswer(matchingPayload);

            const q = this.currentQuestion();

            if (q?.oid) {
              this.answeredQuestions.update(set => {
                const s = new Set(set);
                s.add(q.oid);
                return s;
              })
            }
            this.saveExamProgress();
            this.updateIndex();
          }
        });
    }
  }

  updateIndex() {
    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
    }
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


  createChoicePayload(answers: any) {
    const payload: choiceQuestionExamSubmit = {
      studentExamOid: this.shared.studentExamId(),
      questions: [answers],
      createdBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    }
    return payload
  }

  createMatchingPayload(answers: any) {
    const payload = {
      studentExamOid: this.shared.studentExamId(),
      questionOid: this.currentQuestion()?.oid,
      answers: answers,
      createdBy: '3fa85f64-5717-4562-b3fc-2c963f66afa6'

    };
    return payload;
  }

  private saveExamProgress() {
    if (!this.isBrowser) return;

    const key = this.getStorageKey(this.currentExamId());

    localStorage.setItem(
      key,
      JSON.stringify({
        saveForLater: this.saveForLater,
        examMode: this.currentMode(),
        studentId: this.auth.loggedStudent()?.userId,
        studentExamId: this.shared.studentExamId(),
        currentQuestionIndex: this.currentQuestionIndex(),
        examChoiceAnswers: this.examChoiceAnswers,
        examMatchingAnswers: this.examMatchingAnswers,
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
