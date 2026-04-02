// src\app\components\AdminPanel\certifications\certification-question\certification-question.component.ts


import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, concatMap, debounceTime, distinctUntilChanged, filter, forkJoin, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SpkNgSelectComponent } from '../../../../shared/spk-ng-select/spk-ng-select.component';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { FileUploadComponent } from '../../../../shared/file-upload/file-upload.component';
import { TextareaComponent } from '../../../../shared/text-area/text-area.component';

import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
import { CertificationService } from '../../../../Services/certification.service';
import { ExamsStore } from '../../../../AdminPanelStores/ExamsStore/exam.store';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
import { QuestionsStore } from '../../../../AdminPanelStores/QuestionStores/questions.store';
import { TranslateService } from '../../../../Services/translate.service';
import { BreadcrumbService } from '../../../../Services/breadcrumb.service';
import { TranslatePipe } from '@ngx-translate/core';

type QuestionType = 'MCQ' | 'MATCHING' | null;
type SectionType = QuestionType | 'Multiple Choice Question' | 'Matching';

interface AnswerGroup {
  answerText: string;
  answerText_Ar: string;
  question_Ask: boolean;
  correctAnswerOid: string | null;
  isCorrect: boolean;
  orderNo: number;
  createdBy: string;
  oid?: string;
}

const DEFAULT_USER_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

@Component({
  selector: 'app-certification-question',
  standalone: true,
  imports: [
    SpkNgSelectComponent,
    ButtonComponent,
    InputComponent,
    FileUploadComponent,
    ReactiveFormsModule,
    NgIf,
    TextareaComponent,
    TranslatePipe
  ],
  templateUrl: './certification-question.component.html',
  styleUrl: './certification-question.component.scss'
})
export class CertificationQuestionComponent {
  // Injections
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastingMessagesService);
  private destroyRef = inject(DestroyRef);
  private translateService = inject(TranslateService);
  private breadcrumbService = inject(BreadcrumbService);

  private certificationStore = inject(CertificationsStore);
  private examsStore = inject(ExamsStore);
  private questionStore = inject(QuestionsStore);
  private certificationService = inject(CertificationService);

  // Signals & Computed
  certifications = this.certificationStore.certifications;
  selectedCertification = this.certificationStore.selectedCertification;
  selectedExam = computed(() => this.examsStore.selectedExam());

  examsWithIndex = computed(() => {
    const exams = this.examsStore.exams();
    return exams.map((exam, idx) => ({
      ...exam,
      indexLabel: `${exam.examName}`
    }));
  });

  question = computed(() => this.questionStore.selectedQuestion());

  selectedType = signal<QuestionType>(null);
  activeSection = signal<SectionType>(null);

  // Form flow flags
  addAnswersFlag = signal(true);
  addChoiceAnswersFlag = signal(false);
  addDragQuestionsFlag = signal(false);
  addDragAnswersFlag = signal(false);
  linkDragAnswerAndQuestionFlag = signal(false);

  editMode = false;
  questionId = '';
  choiceAnswerOrderCounter = 0;
  private lastAutoTranslatedAr = '';
  private shouldNavigateBack = true;

  pendingQuestionType = signal<any>(null);
  apiAnswers = signal<any[]>([]);
  apiQuestions: any[] = [];

  // Options
  questionTypes: any[] = [];
  questionMarks = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
  ];

  status = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];

  // Form
  form = this.fb.group({
    certification: ['', Validators.required],
    coursesMasterExamOid: ['', Validators.required],
    questionTypeLookupId: ['33333333-3333-3333-3333-333333333301', Validators.required],
    questionText: ['', [Validators.required]],
    questionText_Ar: [''],
    questionExplination: [''],
    orderNo: ['', Validators.required],
    questionScore: [1],
    isActive: [true, Validators.required],
    correctAnswer: [true],
    question: [true],
    correctChoiceOid: [null],
    createdBy: [DEFAULT_USER_ID, Validators.required],
    answers: this.fb.array([]),
    dragQuestions: this.fb.array([]),
    dragAnswers: this.fb.array([]),
    files: [[] as File[]],
  });

  get answersArray(): FormArray { return this.form.get('answers') as FormArray; }
  get dragQuestionsArray(): FormArray { return this.form.get('dragQuestions') as FormArray; }
  get dragAnswersArray(): FormArray { return this.form.get('dragAnswers') as FormArray; }

  // Lifecycle & Effects
  constructor() {
    this.loadQuestionTypes();
    this.setupEffects();
    this.setupAutoTranslation();
  }

  private loadQuestionTypes(): void {
    this.certificationService.getQuestionTypes().subscribe(types => {
      this.questionTypes = types;
      const pending = this.pendingQuestionType();
      if (pending) {
        this.applyQuestionType(pending);
        this.pendingQuestionType.set(null);
      }

      // Trigger the default question type if set and not in edit mode
      if (!this.editMode) {
        const defaultTypeId = this.form.get('questionTypeLookupId')?.value;
        if (defaultTypeId && defaultTypeId !== '') {
          this.applyQuestionType(defaultTypeId);
        }
      }
    });
  }

  private setupEffects(): void {
    effect(() => {
      const certId = this.route.snapshot.paramMap.get('id');
      if (certId && !this.selectedCertification()?.oid) {
        this.certificationStore.getCertification(certId);
      }
    });

    effect(() => {
      const qid = this.route.snapshot.paramMap.get('questionId');
      if (qid && !this.question()) {
        this.questionStore.getQuestion(qid);
        this.questionId = qid;
      }
    });

    effect(() => {
      const examId = this.route.snapshot.paramMap.get('examId');
      if (examId && !this.selectedExam()?.oid) {
        this.examsStore.getExam(examId);
      }
    });

    effect(() => {
      const cert = this.selectedCertification();
      const exam = this.selectedExam();
      const question = this.question();
      const questionId = this.route.snapshot.paramMap.get('questionId');

      if (cert && exam) {
        const breadcrumbs = [
          { label: 'Admin', url: '/admin' },
          { label: 'Certifications', url: '/admin/certifications' },
          { label: cert.courseName || 'Certification', url: `/admin/certifications/${cert.oid}` },
          { label: exam.courseName || 'Exam', url: `/admin/certifications/${cert.oid}/exams/exam/${exam.oid}` },
        ];

        if (questionId) {
          breadcrumbs.push({ label: question?.questionText || 'Question Details', url: '' });
        } else {
          breadcrumbs.push({ label: 'Create Question', url: '' });
        }

        this.breadcrumbService.setBreadcrumbs(breadcrumbs);
      }
    });

    effect(() => {
      const q = this.question();
      if (!q) return;
      if (q.oid)
        this.questionId = q.oid;
      this.editMode = true;
      this.choiceAnswerOrderCounter = 0;

      this.patchBasicQuestionFields(q);
      this.populateAnswersOrDragItems(q);
      this.selectedType.set(this.resolveSelectedType(q.questionTypeName));
      this.activeSection.set(q.questionTypeName as SectionType);
    });

    effect(() => {
      const cert = this.selectedCertification();
      if (!cert?.oid) return;

      this.form.patchValue({
        certification: cert.oid,
        coursesMasterExamOid: this.selectedExam()?.oid ?? this.route.snapshot.paramMap.get('examId')
      });
    });

    // Auto-calculate orderNo for new questions based on max existing orderNo + 1
    effect(() => {
      const exam = this.selectedExam();
      const questionId = this.route.snapshot.paramMap.get('questionId');

      // Only auto-calculate for new questions (not edit mode)
      if (!questionId && !this.form.get('orderNo')?.value && exam?.oid) {
        const filters = [{
          propertyName: "coursesMasterExamOid",
          value: exam.oid,
          operation: 0
        }];

        // Create a request to get all questions for this exam
        const request = {
          filters,
          sort: [],
          pagination: { getAll: true, pageNumber: 0, pageSize: 1000 },
          columns: []
        };

        this.certificationService.searchQuestion(request).subscribe({
          next: (res) => {
            const questions = res.questions;
            const maxOrderNo = questions?.length > 0
              ? Math.max(...questions.map(q => q.orderNo ?? 0))
              : 0;
            const nextOrderNo = maxOrderNo + 1;
            this.form.patchValue({ orderNo: String(nextOrderNo) });
          },
          error: () => {
            // If error, default to 1
            this.form.patchValue({ orderNo: '1' });
          }
        });
      }
    });

    effect(() => {
      if (this.certificationStore.success()) {
        this.cancel();
        this.certificationStore.setSuccess(false);
      }
    });

    effect(() => {
      if (this.questionStore.success()) {
        this.toast.showToast('question.save.success', 'success');
        this.questionStore.setSuccess(false);

        if (this.shouldNavigateBack) {
          // Navigate to exam details screen
          const certId = this.route.snapshot.paramMap.get('id') || this.selectedCertification()?.oid;
          const examId = this.route.snapshot.paramMap.get('examId') || this.selectedExam()?.oid;

          if (certId && examId) {
            this.router.navigate(['/admin/certifications', certId, 'exams', 'exam', examId]);
          } else {
            this.location.back();
          }
        } else {
          // Reset form for new question while keeping certification and exam
          this.resetFormForNewQuestion();
        }
      }
    });

    effect(() => {
      if (this.editMode) return;
      const type = this.selectedType();
      if (!type) return;

      this.resetFormArrays();

      if (type === 'MCQ') {
        this.answersArray.push(this.createAnswerGroup(false));
      } else if (type === 'MATCHING') {
        this.dragQuestionsArray.push(this.createDragQuestionGroup());
        this.dragAnswersArray.push(this.createDragAnswerGroup());
      }
    });
  }

  private resetFormArrays(): void {
    this.answersArray.clear();
    this.dragQuestionsArray.clear();
    this.dragAnswersArray.clear();
    this.apiQuestions = [];
    this.apiAnswers.set([]);
    this.linkDragAnswerAndQuestionFlag.set(false);
    this.addDragAnswersFlag.set(false);
    this.choiceAnswerOrderCounter = 0;
  }

  // Form Group Factories
  private createAnswerGroup(isQuestion = false, existing?: Partial<AnswerGroup>): FormGroup {
    const group = this.fb.group({
      answerText: [existing?.answerText ?? '', [
        Validators.required,
      ]],
      answerText_Ar: [existing?.answerText_Ar ?? ''],
      question_Ask: [existing?.question_Ask ?? isQuestion],
      correctAnswerOid: [
        existing?.correctAnswerOid != null ? String(existing.correctAnswerOid) : null
      ],
      isCorrect: [existing?.isCorrect ?? false],
      orderNo: [existing?.orderNo ?? this.choiceAnswerOrderCounter, Validators.required],
      createdBy: [existing?.createdBy ?? DEFAULT_USER_ID, Validators.required],
    });

    if (existing?.oid) {
      (group as FormGroup<any>).addControl('oid', this.fb.control(existing.oid));
    }

    const answerTextControl = group.get('answerText');
    const answerTextArControl = group.get('answerText_Ar');
    if (answerTextControl && answerTextArControl) {
      let lastAutoTranslatedAr = String(existing?.answerText_Ar ?? '').trim();
      answerTextControl.valueChanges
        .pipe(
          debounceTime(400),
          map(value => String(value ?? '').trim()),
          distinctUntilChanged(),
          switchMap(text => {
            const currentAr = String(answerTextArControl.value ?? '').trim();
            if (!text) return of('');
            if (currentAr && currentAr !== lastAutoTranslatedAr) {
              return of(null);
            }
            return this.translateService.translateEnToAr(text).pipe(
              catchError(() => of(''))
            );
          }),
          filter(translated => translated !== null),
          tap(translated => {
            if (!translated) return;
            lastAutoTranslatedAr = translated;
            answerTextArControl.setValue(translated, { emitEvent: false });
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }

    this.choiceAnswerOrderCounter++;
    return group;
  }

  private createDragQuestionGroup(existing?: any): FormGroup {
    return this.createAnswerGroup(true, existing);
  }

  private createDragAnswerGroup(existing?: any): FormGroup {
    return this.createAnswerGroup(false, existing);
  }

  // Form Actions
  addAnswer(): void {
    this.answersArray.push(this.createAnswerGroup(false));
  }

  onAnswerInputClick(index: number): void {
    if (index !== this.answersArray.length - 1) return;
    const control = this.answersArray.at(index)?.get('answerText');
    const value = String(control?.value ?? '').trim();
    if (!value) return;
    this.addAnswer();
  }

  addDragQuestion(): void {
    this.dragQuestionsArray.push(this.createDragQuestionGroup());
  }

  addDragAnswer(): void {
    this.dragAnswersArray.push(this.createDragAnswerGroup());
  }

  removeAnswer(index: number, control: AbstractControl): void {
    if (this.editMode && control.get('oid')?.value) {
      this.questionStore.deleteAnswer(control.get('oid')!.value as string);
    }
    this.answersArray.removeAt(index);
  }

  removeDragQuestion(index: number, control: AbstractControl): void {
    if (this.editMode && control.get('oid')?.value) {
      this.questionStore.deleteAnswer(control.get('oid')!.value as string);
    }
    this.dragQuestionsArray.removeAt(index);
  }

  removeDragAnswer(index: number, control: AbstractControl): void {
    if (this.editMode && control.get('oid')?.value) {
      const linkedQuestion = this.question()?.answers.find(
        a => a.correctAnswerOid === control.get('oid')!.value
      );
      if (linkedQuestion?.oid) {
        this.questionStore.updateQuestion({
          id: linkedQuestion.oid,
          body: { ...linkedQuestion, correctAnswerOid: null, updatedBy: DEFAULT_USER_ID }
        });
      }
      this.questionStore.deleteAnswer(control.get('oid')!.value as string);
    }
    this.dragAnswersArray.removeAt(index);
  }

  DoneWithDragAnswer() {
    if (this.editMode) {
      this.linkDragAnswerAndQuestionFlag.set(true);
      return;
    }

    const payload = this.getDragQuestionPayload();

    this.certificationService.createQuestion(payload).subscribe({
      next: (response) => {
        this.questionId = response.oid;
        this.apiQuestions = response.answers?.filter((a: any) => a.question_Ask) || [];
        this.apiAnswers.set(response.answers?.filter((a: any) => !a.question_Ask) || []);
        this.linkDragAnswerAndQuestionFlag.set(true);
        this.toast.showToast('question.create.success', 'success');
      },
      error: (err) => {
        this.toast.showToast('question.create.error', 'error');
        console.error(err);
      }
    });
  }

  // Question Type Selection & Reset
  onSelectedQuestionType(typeOid: string): void {
    if (this.questionTypes.length === 0) {
      this.pendingQuestionType.set(typeOid);
      return;
    }
    this.applyQuestionType(typeOid);
  }

  private applyQuestionType(typeOid: string): void {
    const type = this.questionTypes.find(t => t.oid === typeOid);
    if (!type) return;

    this.selectedType.set(type.lookupValue);
    this.activeSection.set(type.lookupValue);
  }

  // Edit Mode – Populate Form
  private patchBasicQuestionFields(question: any): void {
    this.form.patchValue({
      certification: this.selectedCertification()?.oid,
      coursesMasterExamOid: question.coursesMasterExamOid,
      questionTypeLookupId: question.questionTypeLookupId,
      questionText: question.questionText,
      questionText_Ar: question.questionText_Ar,
      questionExplination: question.questionExplination,
      orderNo: String(question.orderNo),
      questionScore: question.questionScore,
      isActive: question.isActive,
      correctAnswer: question.correctAnswer,
      question: question.question,
      correctChoiceOid: null,
      createdBy: question.createdBy,
    });

    this.lastAutoTranslatedAr = question.questionText_Ar ?? '';
  }

  private setupAutoTranslation(): void {
    const questionTextControl = this.form.get('questionText');
    const questionTextArControl = this.form.get('questionText_Ar');
    if (!questionTextControl || !questionTextArControl) return;

    questionTextControl.valueChanges
      .pipe(
        debounceTime(500),
        map(value => String(value ?? '').trim()),
        distinctUntilChanged(),
        switchMap(text => {
          const currentAr = String(questionTextArControl.value ?? '').trim();
          if (!text) return of('');
          if (currentAr && currentAr !== this.lastAutoTranslatedAr) {
            return of(null);
          }
          return this.translateService.translateEnToAr(text).pipe(
            catchError(() => of(''))
          );
        }),
        filter(translated => translated !== null),
        tap(translated => {
          if (!translated) return;
          this.lastAutoTranslatedAr = translated;
          questionTextArControl.setValue(translated, { emitEvent: false });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private populateAnswersOrDragItems(question: any): void {
    if (question.questionTypeName === 'True/False' || question.questionTypeName === 'Multiple Choice Question') {
      const answerControls = question.answers?.map((a: any) => this.createAnswerGroup(false, a)) ?? [];
      this.form.setControl('answers', this.fb.array(answerControls));
    } else {
      //console.log('question', question);
      const sortByOrder = (items: any[]) =>
        items.slice().sort((a, b) => (a?.orderNo ?? 0) - (b?.orderNo ?? 0));

      const questions = sortByOrder(question.answers?.filter((a: any) => a.question_Ask) ?? [])
        .map((q: any) => ({
          ...q,
          oid: q?.oid != null ? String(q.oid) : q.oid
        }));
      const answers = sortByOrder(question.answers?.filter((a: any) => !a.question_Ask) ?? [])
        .map((a: any) => ({
          ...a,
          oid: a?.oid != null ? String(a.oid) : a.oid
        }));

      (this.form as FormGroup<any>).setControl('dragQuestions', this.fb.array(
        questions.map((q: any) => this.createDragQuestionGroup(q))
      ));

      (this.form as FormGroup<any>).setControl('dragAnswers', this.fb.array(
        answers.map((a: any) => this.createDragAnswerGroup(a))
      ));
      this.addDragAnswersFlag.set(true);
      this.apiQuestions = questions;
      this.apiAnswers.set(answers);
      //console.log('questions', questions);
      this.syncCorrectAnswerSelections(questions, answers);
      this.linkDragAnswerAndQuestionFlag.set(true);
    }
  }

  private syncCorrectAnswerSelections(questions: any[], answers: any[]): void {
    setTimeout(() => {
      this.dragQuestionsArray.controls.forEach((ctrl, index) => {
        const originalQuestion = questions[index];
        if (originalQuestion?.correctAnswerOid == null) return;
        const desiredValue = String(originalQuestion.correctAnswerOid);
        const hasMatch = answers.some(a => String(a?.oid) === desiredValue);
        const value = hasMatch ? desiredValue : String(answers[index]?.oid ?? '');
        if (!value) return;
        console.log('value',value);
        ctrl.get('correctAnswerOid')?.setValue(value, { emitEvent: false });
      });
    }, 0);
  }

  // Submit / Cancel
  onSubmit(stayOnForm: boolean = false): void {
    this.shouldNavigateBack = !stayOnForm;

    if (this.selectedType()?.toLowerCase() === 'matching' && !this.editMode) {
      this.answersArray.clear();
    }

    // Validate MCQ type has at least one correct answer
    if (this.selectedType() === 'MCQ') {
      const hasCorrectAnswer = this.answersArray.controls.some(
        control => control.get('isCorrect')?.value === true
      );

      if (!hasCorrectAnswer) {
        this.toast.showToast('question.validation.correctRequired', 'error');
        return;
      }
    }

    //console.log('Form invalid?', this.form.invalid);
    //console.log('Form value:', this.form.value);

    if (this.form.invalid) {
      // this.logAllInvalidControls();
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    //console.log('payload', payload);
    //console.log('edit mode', this.editMode);
    if (!this.editMode) {
      //console.log('selectedType', this.selectedType())
      if (this.selectedType() !== 'MATCHING') {
        this.questionStore.addQuestion(payload);
      } else {
        //console.log('subit deag questions');
        this.updateMatchingQuestions();
      }
    } else {
      this.updateExistingQuestionAndAnswers();
    }
  }

  cancel(): void {
    this.form.reset();
    this.form.markAsUntouched();

    // Navigate to exam details screen
    const certId = this.route.snapshot.paramMap.get('id') || this.selectedCertification()?.oid;
    const examId = this.route.snapshot.paramMap.get('examId') || this.selectedExam()?.oid;

    if (certId && examId) {
      this.router.navigate(['/admin/certifications', certId, 'exams', 'exam', examId]);
    } else {
      this.location.back();
    }
  }

  private resetFormForNewQuestion(): void {
    const certId = this.form.get('certification')?.value;
    const examId = this.form.get('coursesMasterExamOid')?.value;
    const questionType = this.form.get('questionTypeLookupId')?.value;

    // Reset the form
    this.form.reset();
    this.form.markAsUntouched();

    // Clear arrays
    this.resetFormArrays();

    // Restore the certification, exam, and question type, and set defaults
    this.form.patchValue({
      certification: certId,
      coursesMasterExamOid: examId,
      questionTypeLookupId: questionType,
      isActive: true,
      correctAnswer: true,
      question: true,
      questionScore: 1,
      createdBy: DEFAULT_USER_ID
    });

    // Re-apply the question type to set up the sections properly
    if (questionType) {
      this.applyQuestionType(questionType);
    }

    // Re-add initial answer/drag items based on question type
    const type = this.selectedType();
    if (type === 'MCQ') {
      this.answersArray.push(this.createAnswerGroup(false));
    } else if (type === 'MATCHING') {
      this.dragQuestionsArray.push(this.createDragQuestionGroup());
      this.dragAnswersArray.push(this.createDragAnswerGroup());
    }

    // Re-trigger orderNo calculation
    const exam = this.selectedExam();
    if (exam?.oid) {
      const filters = [{
        propertyName: "coursesMasterExamOid",
        value: exam.oid,
        operation: 0
      }];

      const request = {
        filters,
        sort: [],
        pagination: { getAll: true, pageNumber: 0, pageSize: 1000 },
        columns: []
      };

      this.certificationService.searchQuestion(request).subscribe({
        next: (res) => {
          const questions = res.questions;
          const maxOrderNo = questions?.length > 0
            ? Math.max(...questions.map(q => q.orderNo ?? 0))
            : 0;
          const nextOrderNo = maxOrderNo + 1;
          this.form.patchValue({ orderNo: String(nextOrderNo) });
        },
        error: () => {
          this.form.patchValue({ orderNo: '1' });
        }
      });
    }
  }

  // Payload Builders
  private buildBasePayload(raw: any) {
    return {
      coursesMasterExamOid: raw.coursesMasterExamOid,
      questionText: raw.questionText,
      questionText_Ar: raw.questionText_Ar,

      questionTypeLookupId: raw.questionTypeLookupId,
      questionScore: raw.questionScore,
      orderNo: raw.orderNo,
      isActive: raw.isActive,
      correctAnswer: raw.correctAnswer,
      questionExplination: raw.questionExplination,
      question: raw.question,
      correctChoiceOid: raw.correctChoiceOid,
      createdBy: raw.createdBy,
    };
  }

  private mapAnswers(
    source: any[],
    overrides: Partial<{ question_Ask: boolean; isCorrect: boolean }> = {}
  ) {
    return source.map((a: any) => ({
      ...(a.oid && { oid: a.oid }),
      answerText: a.answerText,
      answerText_Ar: a.answerText_Ar,
      question_Ask: overrides.question_Ask ?? a.question_Ask ?? false,
      correctAnswerOid: a.correctAnswerOid ?? null,
      isCorrect: overrides.isCorrect ?? a.isCorrect ?? false,
      orderNo: a.orderNo,
      questionExplination: a.questionExplination,
      createdBy: a.createdBy,
    }));
  }

  private getDragQuestionPayload() {
    const raw = this.form.getRawValue();
    const apiAnswers = this.apiAnswers();
    const apiQuestions = this.apiQuestions ?? [];

    const questionAnswers = this.mapAnswers(raw.dragQuestions, {
      question_Ask: true,
      isCorrect: false,
    }).map((q: any, index: number) => ({
      ...q,
      oid: q.oid ?? apiQuestions[index]?.oid ?? null
    }));

    const dragAnswers = this.mapAnswers(raw.dragAnswers, {
      question_Ask: false,
    }).map((a: any, index: number) => ({
      ...a,
      oid: a.oid ?? apiAnswers[index]?.oid ?? null
    }));

    console.log('draganSWERS', dragAnswers);
    const questionsWithLinks = questionAnswers.map((q: any, index: number) => {
      // Use the correctAnswerOid selected in the form dropdown; fall back to positional match
      const selectedOid = raw.dragQuestions?.[index]?.correctAnswerOid ?? null;
      const resolvedOid = selectedOid
        ?? dragAnswers[index]?.oid
        ?? null;
      return { ...q, correctAnswerOid: resolvedOid };
    });

    console.log('questionsWithLinks', questionsWithLinks);


    return {
      oid: this.questionId || undefined,
      ...this.buildBasePayload(raw),
      answers: [...questionsWithLinks, ...dragAnswers],
    };
  }

  private buildPayload(): any {
    const raw = this.form.getRawValue();

    if (this.isMatchingSection()) {
      return this.getDragQuestionPayload();
    }

    return {
      oid: this.questionId || undefined,
      ...this.buildBasePayload(raw),
      answers: this.mapAnswers(raw.answers || [], { question_Ask: false }),
    };
  }

  private isMatchingSection(): boolean {
    const section = String(this.activeSection() ?? '').toLowerCase();
    if (section.includes('match')) return true;
    const type = String(this.selectedType() ?? '').toLowerCase();
    return type === 'matching' || type === 'match' || type === 'matchin';
  }

  private resolveSelectedType(typeName?: string | null): QuestionType {
    const name = String(typeName ?? '').toLowerCase();
    if (name.includes('match')) return 'MATCHING';
    if (name.includes('multiple choice') || name.includes('true/false')) return 'MCQ';
    return null;
  }

  private updateMatchingQuestions(): void {
    const payload = this.getDragQuestionPayload();
    payload.answers = (payload.answers ?? []).map((a: any) => ({
      ...a,
      questionId: this.questionId || a.questionId,
      updatedBy: DEFAULT_USER_ID
    }));

    this.certificationService.updateCourseQuestion(payload).subscribe({
      next: () => {
        this.toast.showToast('question.matching.update.success', 'success');
        this.location.back();
      },
      error: (err) => {
        console.error('Batch update failed', err);
        this.toast.showToast('question.matching.update.error', 'error');
      }
    });
  }

  private updateExistingQuestionAndAnswers(): void {
    const payload = this.buildPayload();
    payload.updatedBy = DEFAULT_USER_ID;
    payload.answers = (payload.answers ?? []).map((a: any) => ({
      ...a,
      questionId: this.questionId || a.questionId,
      updatedBy: DEFAULT_USER_ID
    }));

    this.certificationService.updateCourseQuestion(payload).subscribe({
      next: () => {
        this.toast.showToast('question.update.success', 'success');
        this.location.back();
      },
      error: (err) => {
        console.error('Update failed', err);
        this.toast.showToast('question.update.error', 'error');
      }
    });
  }

  // private logAllInvalidControls() {
  //   const invalid: { path: string; errors: any; value: any }[] = [];

  //   const traverse = (control: AbstractControl, path: string = '') => {
  //     if (control.invalid) {
  //       invalid.push({
  //         path: path || '(root)',
  //         errors: control.errors,
  //         value: control.value
  //       });
  //     }

  //     if (control instanceof FormGroup) {
  //       Object.entries(control.controls).forEach(([key, child]) => {
  //         traverse(child, path ? `${path}.${key}` : key);
  //       });
  //     } else if (control instanceof FormArray) {
  //       control.controls.forEach((child, idx) => {
  //         traverse(child, path ? `${path}[${idx}]` : `${idx}`);
  //       });
  //     }
  //   };

  //   traverse(this.form);

  //   if (invalid.length === 0) {
  //     //console.log('No invalid controls found');
  //   } else {
  //     console.table(invalid);
  //   }
  // }
}
