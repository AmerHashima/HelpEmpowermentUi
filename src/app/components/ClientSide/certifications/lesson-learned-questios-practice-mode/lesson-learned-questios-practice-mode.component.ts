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
import { StudentExamService } from '../../../../Services/student-exam.service';
import { CertificationService } from '../../../../Services/certification.service';

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
  private certificationService = inject(CertificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute)
  private isBrowser = isPlatformBrowser(this.platformId);
  private questionStore = inject(QuestionsStore);
  private shared = inject(Shared);
  private toasting = inject(ToastingMessagesService);
  isRTL = this.shared.isRtl;
  examQuestions=signal<any[]>([]);
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
  questions = computed(() => {
    const list = this.questionStore.questions() ?? [];
    return [...list].sort((a, b) => a.orderNo - b.orderNo);
  });
  filteredExamQuestions = computed(() => {
    const examQs = this.examQuestions();
    const qs = this.questions();
    if (qs.length == 0 || examQs.length ==0) return [];
    const questionOids = new Set(qs.map(q => q.oid));
    const examQuestions = examQs.filter(eq => questionOids.has(eq.oid));
    return [...examQuestions].sort((a, b) => a.orderNo - b.orderNo);
;
  });
  answeredQuestions = signal<Set<string>>(new Set());
  boardQuestions = computed(() => {
    const list = this.filteredExamQuestions() ?? [];
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
    const qs = this.filteredExamQuestions();
    const idx = this.currentQuestionIndex();
    if (qs.length === 0 || idx < 0 || idx >= qs.length) return null;
    return this.mapToClientQuestion(qs[idx], idx);
  });


  constructor() {
    if (this.isBrowser) {
      this.route.queryParamMap.subscribe(params => {
        this.currentType.set(params.get('type') ?? '');
        this.studentExamId.set(params.get('examId') ?? '');
      });
    }


    effect(() => {
      if (!this.isBrowser) return;
      const success = this.questionStore.practiceQuestionsSuccess();
      if (success)
      {
        const requestBody=  {
          filters: [{
            propertyName: "coursesMasterExamOid",
            value: this.shared.currentExamId(),
            operation: 0
          }],
          sort: [],
          pagination: {
            getAll: true,
            pageNumber: 0,
            pageSize: 0,
          },
          columns: []
        }

        this.certificationService.searchQuestion(requestBody).subscribe({
          next:(data:any)=>{
            this.examQuestions.set(data.questions);
            this.questionStore.setPracticeQueationSuccess(false);

          }
        })
      }
    });

    effect(() => {
      if (!this.isBrowser) return;
      const practiceType = this.currentType();
      const studentExamId = this.studentExamId();
      let lookupId=null;
      if (practiceType && studentExamId) {
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
          if (!saved) {
            this.resetExam();
            return;
          }

          const parsed = JSON.parse(saved);

          if (!parsed.saveForLater) {
            this.resetExam();
            return;
          }

          this.saveForLater = parsed.saveForLater;
          this.currentQuestionIndex.set(parsed.currentQuestionIndex ?? 0);
          this.examChoiceAnswers = parsed.examChoiceAnswers ?? [];
          this.examMatchingAnswers = parsed.examMatchingAnswers ?? [];

          if (parsed.markedQuestions) {
            this.markedQuestions.set(new Set(parsed.markedQuestions));
          }

          if (parsed.answeredQuestions) {
            this.answeredQuestions.set(new Set(parsed.answeredQuestions));
          }
        }
      }
    });


    effect(() => {
      if (this.filteredExamQuestions().length > 0) {
        if (this.currentQuestionIndex() >= this.filteredExamQuestions().length) {
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
      this.toasting.showToast('examToast.save.success', 'success');
    }

    this.router.navigate(['../../chooseExam'], {
      relativeTo: this.route,
    });
  }



  finishExam(end: boolean) {
    if (this.isBrowser) {
      const key = this.getStorageKey(this.studentExamId());
      localStorage.removeItem(key);
      this.toasting.showToast('examToast.finish.success', 'success');
    }
    this.router.navigate(['../../chooseExam'], {
      relativeTo: this.route,
    });
  }



  resetExam() {
    this.currentQuestionIndex.set(0);
    this.examChoiceAnswers = [];
    this.examMatchingAnswers = [];
    this.markedQuestions.set(new Set([]));
    this.answeredQuestions.set(new Set([]));
    if (this.isBrowser) {
      const key = this.getStorageKey(this.studentExamId());
      localStorage.removeItem(key);
    }
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

    const total = this.filteredExamQuestions().length;

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

      orderNo: index + 1,

      progress: Math.round(((index + 1) / Math.max(1, total)) * 100),
      totalQuestions: total,

      maxChoices: q.answers.filter((o: any) => o.isCorrect).length || 1
    };
  }


  private getStorageKey(examId: string) {
    return `exam-progress-lesson-learned-type-${this.currentType()}-student_${this.auth.loggedStudent()?.userId}-studentExamId-${examId}`;
  }



  updateIndex(last: boolean = false) {
    if (!last) {
      if (this.currentQuestionIndex() < this.filteredExamQuestions().length - 1) {
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

      const isCorrect = this.checkMultipleChoiceAnswer(
        q,
        newAnswer.answers.selectedAnswerOids
      );

      this.toasting.showToast(
        isCorrect ? 'examToast.finish.correctAnswer' : 'examToast.finish.wrongAnswer',
        isCorrect ? 'success' : 'error'
      );

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

      const isCorrect = this.checkMatchingAnswer(
        q,
        newAnswer.answers
      );

      this.toasting.showToast(
        isCorrect ? 'examToast.finish.correctMatch' : 'examToast.finish.wrongMatch',
        isCorrect ? 'success' : 'error'
      );

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
    if (index >= 0 && index < this.filteredExamQuestions().length) {
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
}
