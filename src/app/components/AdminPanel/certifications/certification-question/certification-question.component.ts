// import { Component, computed, effect, inject, signal } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { AsyncPipe, JsonPipe, Location } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { catchError, concatMap, defer, EMPTY, forkJoin, from, map, Observable, of } from 'rxjs';
// import { SpkNgSelectComponent } from '../../../../shared/spk-ng-select/spk-ng-select.component';
// import { ButtonComponent } from '../../../../shared/button/button.component';
// import { InputComponent } from '../../../../shared/input/input.component';
// import { FileUploadComponent } from '../../../../shared/file-upload/file-upload.component';
// import { TextareaComponent } from '../../../../shared/text-area/text-area.component';
// import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
// import { CertificationService } from '../../../../Services/certification.service';
// import { ExamsStore } from '../../../../AdminPanelStores/ExamsStore/exam.store';
// import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';
// import { QuestionsStore } from '../../../../AdminPanelStores/QuestionStores/questions.store';

// @Component({
//   selector: 'app-certification-question',
//   imports: [SpkNgSelectComponent, ButtonComponent, InputComponent,
//     FileUploadComponent, ReactiveFormsModule, AsyncPipe, JsonPipe,
//     TextareaComponent],
//   templateUrl: './certification-question.component.html',
//   styleUrl: './certification-question.component.scss'
// })
// export class CertificationQuestionComponent {
//   private location = inject(Location);
//   private route = inject(ActivatedRoute);
//   private store = inject(CertificationsStore);
//   private examsStore = inject(ExamsStore);
//   private questionStore = inject(QuestionsStore);
//   private certificationService = inject(CertificationService);
//   private certificationStore = inject(CertificationsStore);
//   private toast = inject(ToastingMessagesService);
//   private router = inject(Router);
//   addAnswersFlag = signal<boolean>(true);
//   addChoiceAnswersFlag = signal<boolean>(false);
//   addDragQuestionsFlag = signal<boolean>(false);
//   addDragAnswersFlag = signal<boolean>(false);
//   linkDragAnswerAndQuestionFlag = signal<boolean>(false);
//   questionTypes: any[] = [];
//   editMode: boolean = false;
//   selectedType = signal<'MCQ' | 'TRUE_FALSE' | 'MATCHING' | null>(null);;
//   requestPayload = signal<any>({});
//   activeSection = signal<'MCQ' | 'TRUE_FALSE' | 'MATCHING' | 'True/False' | "Multiple Choice Question" | 'Matching' | null>(null);
//   certifications = this.certificationStore.certifications;
//   certification = this.certificationStore.selectedCertification;
//   certificationId = this.route.snapshot.paramMap.get('id');
//   // examId = this.route.snapshot.paramMap.get('examId');
//   exam = computed(() => this.examsStore.selectedExam());


//   exams = computed(() => {
//     return this.examsStore.exams().map((exam, idx) => ({
//       ...exam,
//       indexLabel: `${idx + 1}`,
//     }));
//   });
//   questionMarks = [
//     { label: "1", value: 1 },
//     { label: "2", value: 2 },

//   ];

//   // examModes$ = this.certificationService.getExamModes();

//   status = [
//     { label: 'Active', value: true },
//     { label: 'Inactive', value: false },
//   ];

//   fb = inject(FormBuilder);
//   form = this.fb.group({
//     certification: ['', Validators.required],
//     coursesMasterExamOid: ['', Validators.required],
//     // examMode: [''],
//     questionTypeLookupId: ['', Validators.required],
//     questionText: ['', Validators.required],
//     orderNo: ['', Validators.required],
//     questionScore: [0, Validators.required],
//     isActive: [true, Validators.required],
//     correctAnswer: [true, Validators.required],
//     question: [true, Validators.required],
//     // correctChoiceOid: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', Validators.required],
//     correctChoiceOid: [null, Validators.required],
//     // files: [[] as File[]],
//     createdBy: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', Validators.required],
//     answers: this.fb.array([this.createAnswerGroup()]),
//     dragQuestions: this.fb.array([this.createDragQuestionGroup()]),
//     dragAnswers: this.fb.array([this.createDragAnswerGroup()]),
//     correctDragAnswer: [[]]
//   });
//   apiAnswers = [];
//   apiQuestions: any[] = [];
//   private choiceAnswerOrderCounter = 0;
//   questionId = '';
//   question = computed(() => this.questionStore.selectedQuestion());
//   pendingQuestionType = signal<any>(null);
//   constructor() {
//     // this.certificationService.getQuestionTypes().subscribe(types => {
//     //   this.questionTypes = types;
//     // })

//     this.certificationService.getQuestionTypes().subscribe(types => {
//       this.questionTypes = types;

//       const pending = this.pendingQuestionType();
//       if (pending) {
//         this.applyQuestionType(pending);
//         this.pendingQuestionType.set(null);
//       }
//     });

//     effect(() => {
//       if (this.certificationId && !this.certification()) {
//         this.store.getCertification(this.certificationId);
//       }
//     });

//     effect(() => {
//       this.questionId = this.route.snapshot.paramMap.get('questionId')!;
//       if (!this.question() && this.questionId) {
//         console.log('in route effect')
//         this.questionStore.getQuestion(this.questionId);
//       }
//     });

//     effect(() => {
//       const question = this.question();
//       if (!question) {
//         console.log("No question yet → skipping");
//         return;
//       }
//       console.log('in dispatch effect')
//       this.editMode = true;
//       this.choiceAnswerOrderCounter = 0;

//       // Patch the simple fields (you can keep your existing patchValue)
//       this.form.patchValue({
//         certification: this.certification()?.oid,
//         coursesMasterExamOid: question.coursesMasterExamOid,
//         // examMode: '',
//         questionTypeLookupId: question.questionTypeLookupId,
//         questionText: question.questionText,
//         orderNo: String(question.orderNo),
//         questionScore: question.questionScore,
//         isActive: question.isActive,
//         correctAnswer: question.correctAnswer,
//         question: question.question,
//         correctChoiceOid: null,
//         createdBy: question.createdBy,
//       });

//       if (question.questionTypeName !== 'True/False' && question.questionTypeName !== 'Multiple Choice Question') {

//         const questions = question.answers?.filter(a => a.question_Ask) ?? [];
//         const answers = question.answers?.filter(a => !a.question_Ask) ?? [];

//         const dragQuestions = this.fb.array(
//           questions.map(a => this.createGroup(true, a.correctAnswerOid, a))
//         );

//         const dragAnswers = this.fb.array(
//           answers.map(a => this.createGroup(false, null, a))
//         );

//         this.form.setControl('dragQuestions', dragQuestions);
//         this.form.setControl('dragAnswers', dragAnswers);

//         this.addDragAnswersFlag.set(true);
//       } else {
//         const answersArray = this.fb.array(
//           question.answers?.map(a => this.createGroup(false, null, a))
//         );
//         this.form.setControl('answers', answersArray);
//       }
//       this.activeSection.set(question.questionTypeName as any);
//     }

//     );



//     effect(() => {
//       const certification = this.certification();
//       if (!certification?.oid) return;
//       console.log('in certificationn effect')
//       this.form.patchValue({
//         certification: certification.oid,
//         coursesMasterExamOid: this.exam()?.oid
//       });
//     });

//     effect(() => {
//       const success = this.store.success();
//       if (success)
//         this.cancel();
//       this.store.setSuccess(false);
//     });

//     effect(() => {
//       const success = this.questionStore.success();
//       if (success) {
//         this.toast.showToast('Question created successfully', 'success');
//         this.cancel();
//         this.questionStore.setSuccess(false);
//         this.location.back();
//         // this.router.navigate(['/admin/certifications', this.certification()?.oid!, 'exams', 'exam', this.examId]);
//       }
//     });

//     effect(() => {
//       const type = this.selectedType();
//       if (this.editMode) return;
//       console.log('in select effect');
//       console.log('selectedType', this.selectedType());
//       switch (type) {
//         case 'MCQ':
//           this.resetChoiceState();
//           break;
//         case 'TRUE_FALSE':
//           this.resetChoiceState();
//           break;
//         default:
//           this.resetMatchingState();
//       }
//     });

//   }

//   createGroup(question: boolean, correctAnswerOid?: any, existingAnswer?: any): FormGroup {
//     console.log('in create group');
//     const controls: any = {
//       answerText: [
//         existingAnswer?.answerText ?? '',
//         [Validators.required],
//       ],
//       question_Ask: [existingAnswer?.question_Ask ?? question],
//       correctAnswerOid: [
//         existingAnswer?.correctAnswerOid ?? (correctAnswerOid ?? null),
//         Validators.required
//       ],
//       isCorrect: [existingAnswer?.isCorrect ?? false],
//       orderNo: [
//         existingAnswer?.orderNo ?? this.choiceAnswerOrderCounter,
//         Validators.required
//       ],
//       createdBy: [
//         existingAnswer?.createdBy ?? '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//         Validators.required
//       ],
//     };

//     if (existingAnswer?.oid) {
//       controls.oid = [existingAnswer.oid];
//     }

//     const group = this.fb.group(controls);
//     this.choiceAnswerOrderCounter++;
//     return group;
//   }
//   createAnswerGroup(): FormGroup {
//     return this.createGroup(false);
//   }
//   createDragQuestionGroup(): FormGroup {
//     return this.createGroup(true);
//   }
//   createDragAnswerGroup(): FormGroup {
//     return this.createGroup(false);
//   }

//   get answersArray(): FormArray {
//     return this.form.get('answers') as FormArray;
//   }
//   get dragQuestionsArray(): FormArray {
//     return this.form.get('dragQuestions') as FormArray;
//   }

//   get dragAnswersArray(): FormArray {
//     return this.form.get('dragAnswers') as FormArray;
//   }

//   onAddAnotherAnswerSection(): void {
//     this.answersArray.push(this.createAnswerGroup());
//   }

//   onAddAnotherDragQuestion(): void {
//     this.dragQuestionsArray.push(this.createDragQuestionGroup());
//   }
//   onAddAnotherDragAnswer(): void {
//     this.dragAnswersArray.push(this.createDragAnswerGroup());
//   }

//   removeAnswer(index: number, group: any): void {
//     this.answersArray.removeAt(index);
//     if (this.editMode && group.value.oid) {
//       const answerOid = group.value.oid;
//       this.questionStore.deleteAnswer(answerOid);
//     }
//   }

//   removeDragQuestion(index: number, group: any): void {
//     this.dragQuestionsArray.removeAt(index);
//     if (this.editMode && group.value.oid) {
//       const answerOid = group.value.oid;
//       this.questionStore.deleteAnswer(answerOid);
//     }
//   }
//   removeDragAnswer(index: number, group: any): void {
//     this.dragAnswersArray.removeAt(index);
//     if (this.editMode && group.value.oid) {
//       const answerOid = group.value.oid;
//       const dragQuestion = this.question()?.answers.filter(a => a.correctAnswerOid == answerOid)[0];
//       const questionPayload = {
//         oid: dragQuestion?.oid,
//         questionId: dragQuestion?.questionId,
//         question_Ask: dragQuestion?.question_Ask,
//         correctAnswerOid: null,
//         answerText: dragQuestion?.answerText,
//         isCorrect: dragQuestion?.isCorrect,
//         orderNo: dragQuestion?.orderNo,
//         updatedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
//       }
//       this.questionStore.updateQuestion({
//         id: questionPayload.oid!,
//         body: questionPayload
//       })
//       this.questionStore.deleteAnswer(answerOid);
//     }
//   }

//   DoneWithDragQuestion() {
//     this.addDragAnswersFlag.set(true);
//   }

//   DoneWithDragAnswer() {
//     const payload = this.getDragQuestionPayload();
//     if (!this.editMode)
//       this.certificationService.createQuestion(payload).subscribe({
//         next: (response) => {
//           this.questionId = response.oid;
//           this.apiQuestions = response.answers.filter((answer: any) => answer.question_Ask);
//           this.apiAnswers = response.answers.filter((answer: any) => !answer.question_Ask);
//           this.linkDragAnswerAndQuestionFlag.set(true);
//         },
//       });
//     else {

//     }
//   }

//   onActivateAddAnswerSection() {
//     this.activeSection.set(this.selectedType());
//   }

//   onSubmit() {
//     const payload = this.getPayload();
//     if (!this.editMode) {
//       if (this.selectedType() != 'MATCHING') this.questionStore.addQuestion(payload);
//       else {
//         const questionsWithAnswers = this.getUpdateQuestionPayload();
//         from(questionsWithAnswers)
//           .pipe(
//             concatMap(q =>
//               this.questionStore.updateQuestion({ id: q.oid, body: q }) && EMPTY
//             ),
//           )
//           .subscribe({
//             complete: () => {
//               this.toast.showToast('All questions updated successfully', 'success');
//               console.log('finish add action');
//               this.location.back();
//             }
//           });
//       }
//     } else {
//       // const answersToUpdate = payload.answers.filter(a => !!a.oid).map(a => ({ ...a, questionId: this.questionId }));
//      const answersToUpdate = payload.answers
//         .filter(a => !!a.oid)
//         .map(({ createdBy, ...rest }) => ({
//           ...rest,
//           questionId: this.questionId,
//           updatedAt: '2026-02-08T05:21:51.9897681',
//         }));
//       const answersToCreate = payload.answers.filter(a => !a.oid).map(a => ({ ...a, questionId: this.questionId }))
//       console.log('answersToUpdate', answersToUpdate);
//       console.log('answersToCreate', answersToCreate);

//       if (this.selectedType() !== 'MATCHING') {

//         const operations: Observable<any>[] = [];

//         for (const item of [...answersToUpdate, ...answersToCreate]) {
//           let op: Observable<any>;

//           if (item.oid) {
//             op = this.questionStore.updateQuestion$({ id: item.oid!, body: item });
//           } else {
//             op = this.questionStore.addAnswer$(item);
//           }

//           // Very important: prevent one failure from killing everything
//           op = op.pipe(
//             catchError(err => {
//               console.warn('One save failed, continuing others', err);
//               return of(null);
//             })
//           );

//           operations.push(op);
//         }

//         forkJoin(operations).subscribe({
//           next: (results) => {
//             const hasFailures = results.some(r => r === null);

//             if (hasFailures) {
//               this.toast.showToast('Some updates failed to save', 'warning');
//             } else {
//               console.log('All finished');
//               // console.log(this.questionStore.questions())
//               this.toast.showToast('All updates have been saved', 'success');
//               this.location.back();

//             }
//             // const qid = this.questionId;
//             // if (qid) {
//             //   this.questionStore.getQuestion(qid);
//             // }

//           },
//           error: (err) => {
//             this.toast.showToast('Save operation failed unexpectedly', 'error');
//           }
//         });
//       }
//     }

//   }

//   cancel() {
//     this.form.markAsUntouched();
//     this.form.reset();
//     this.location.back();
//   }

//   getPayload() {
//     switch (this.selectedType()) {
//       case 'MCQ':
//         return this.getChoicePayload();
//       case 'TRUE_FALSE':
//         return this.getChoicePayload();
//       default:
//         return this.getDragQuestionPayload()
//     }
//   }


//   getChoicePayload() {
//     console.log('get choice byload')
//     const raw = this.form.getRawValue();
//     return {
//       ...(this.questionId && { oid: this.questionId }),
//       ...this.buildBasePayload(raw),
//       answers: this.mapAnswers(raw.answers),
//     };
//   }

//   getDragQuestionPayload() {
//     const raw = this.form.getRawValue();
//     const questionAnswers = this.mapAnswers(raw.dragQuestions, {
//       question_Ask: true,
//       isCorrect: false,
//     });

//     return {
//       oid: this.questionId,
//       ...this.buildBasePayload(raw),
//       // answers: [...questionAnswers, ...this.apiAnswers],
//       answers: [...questionAnswers, ...this.mapAnswers(raw.dragAnswers)],

//     };
//   }

//   getUpdateQuestionPayload() {
//     const raw = this.form.getRawValue();
//     return raw.dragQuestions.map((a: any, index: number) => ({
//       oid: this.apiQuestions[index].oid,
//       questionId: this.questionId,
//       answerText: a.answerText,
//       question_Ask: true,
//       correctAnswerOid: a.correctAnswerOid,
//       isCorrect: a.isCorrect,
//       orderNo: a.orderNo,
//       updatedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
//     }));
//   }


//   private buildBasePayload(raw: any) {
//     return {
//       coursesMasterExamOid: raw.coursesMasterExamOid,
//       questionText: raw.questionText,
//       questionTypeLookupId: raw.questionTypeLookupId,
//       questionScore: raw.questionScore,
//       orderNo: raw.orderNo,
//       isActive: raw.isActive,
//       correctAnswer: raw.correctAnswer,
//       question: raw.question,
//       correctChoiceOid: raw.correctChoiceOid,
//       createdBy: raw.createdBy,
//     };
//   }
//   private mapAnswers(
//     source: any[],
//     overrides?: Partial<{
//       question_Ask: boolean;
//       isCorrect: boolean;
//     }>
//   ) {
//     return source.map((a: any) => ({
//       ...(a.oid && { oid: a.oid }),
//       answerText: a.answerText,
//       question_Ask: overrides?.question_Ask ?? a.question_Ask,
//       correctAnswerOid: a.correctAnswerOid ?? null,
//       isCorrect: overrides?.isCorrect ?? a.isCorrect ?? false,
//       orderNo: a.orderNo,
//       createdBy: a.createdBy,
//     }));
//   }


//   onSelectedQuestionType(questionType: any) {
//     if (this.questionTypes.length === 0) {
//       this.pendingQuestionType.set(questionType);
//       return;
//     }

//     this.applyQuestionType(questionType);
//   }
//   private applyQuestionType(questionType: any) {
//     const type = this.questionTypes.find(q => q.oid === questionType);
//     if (!type) return;
//     this.selectedType.set(type.lookupValue);
//     this.onActivateAddAnswerSection();
//   }
//   private resetMatchingState() {
//     // reset flags
//     this.addDragQuestionsFlag.set(false);
//     this.addDragAnswersFlag.set(false);
//     this.linkDragAnswerAndQuestionFlag.set(false);

//     // clear form arrays
//     this.dragQuestionsArray.clear();
//     this.dragAnswersArray.clear();

//     // re-add one default item
//     this.dragQuestionsArray.push(this.createDragQuestionGroup());
//     this.dragAnswersArray.push(this.createDragAnswerGroup());
//     // reset counter if needed
//     this.choiceAnswerOrderCounter = 0;
//   }
//   private resetChoiceState() {
//     // clear form arrays
//     this.answersArray.clear();
//     // re-add one default item
//     this.answersArray.push(this.createAnswerGroup());
//     // reset counter if needed
//     this.choiceAnswerOrderCounter = 0;
//   }
// }

import { Component, computed, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, JsonPipe, Location, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, concatMap, forkJoin, from, map, Observable, of } from 'rxjs';

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

type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'MATCHING' | null;
type SectionType = QuestionType | 'True/False' | 'Multiple Choice Question' | 'Matching';

interface AnswerGroup {
  answerText: string;
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
    AsyncPipe,
    JsonPipe,
    NgIf,
    TextareaComponent
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

  private certificationStore = inject(CertificationsStore);
  private examsStore = inject(ExamsStore);
  private questionStore = inject(QuestionsStore);
  private certificationService = inject(CertificationService);

  // Signals & Computed
  certifications = this.certificationStore.certifications;
  selectedCertification = this.certificationStore.selectedCertification;
  selectedExam = computed(() => this.examsStore.selectedExam());

  examsWithIndex = computed(() =>
    this.examsStore.exams().map((exam, idx) => ({
      ...exam,
      indexLabel: `${idx + 1}`
    }))
  );

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

  pendingQuestionType = signal<any>(null);
  apiAnswers=signal<any[]>([]);
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
    questionTypeLookupId: ['', Validators.required],
    questionText: ['', [Validators.required]],
    orderNo: ['', Validators.required],
    questionScore: [1, Validators.required],
    isActive: [true, Validators.required],
    correctAnswer: [true],
    question: [true],
    correctChoiceOid: [null],
    createdBy: [DEFAULT_USER_ID, Validators.required],
    answers: this.fb.array([]),
    dragQuestions: this.fb.array([]),
    dragAnswers: this.fb.array([]),
  });

  get answersArray(): FormArray { return this.form.get('answers') as FormArray; }
  get dragQuestionsArray(): FormArray { return this.form.get('dragQuestions') as FormArray; }
  get dragAnswersArray(): FormArray { return this.form.get('dragAnswers') as FormArray; }

  // Lifecycle & Effects
  constructor() {
    this.loadQuestionTypes();
    this.setupEffects();
  }

  private loadQuestionTypes(): void {
    this.certificationService.getQuestionTypes().subscribe(types => {
      this.questionTypes = types;
      const pending = this.pendingQuestionType();
      if (pending) {
        this.applyQuestionType(pending);
        this.pendingQuestionType.set(null);
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
      const q = this.question();
      if (!q) return;
      if(q.oid)
      this.questionId=q.oid;
      this.editMode = true;
      this.choiceAnswerOrderCounter = 0;

      this.patchBasicQuestionFields(q);
      this.populateAnswersOrDragItems(q);
      this.activeSection.set(q.questionTypeName as SectionType);
    });

    effect(() => {
      const cert = this.selectedCertification();
      if (!cert?.oid) return;

      this.form.patchValue({
        certification: cert.oid,
        coursesMasterExamOid: this.selectedExam()?.oid
      });
    });

    effect(() => {
      if (this.certificationStore.success()) {
        this.cancel();
        this.certificationStore.setSuccess(false);
      }
    });

    effect(() => {
      if (this.questionStore.success()) {
        this.toast.showToast('Question saved successfully', 'success');
        this.cancel();
        this.questionStore.setSuccess(false);
        this.location.back();
      }
    });

    effect(() => {
      if (this.editMode) return;
      const type = this.selectedType();
      if (!type) return;

      this.resetFormArrays();

      if (type === 'MCQ' || type === 'TRUE_FALSE') {
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
      question_Ask: [existing?.question_Ask ?? isQuestion],
      correctAnswerOid: [existing?.correctAnswerOid ?? null],
      isCorrect: [existing?.isCorrect ?? false],
      orderNo: [existing?.orderNo ?? this.choiceAnswerOrderCounter, Validators.required],
      createdBy: [existing?.createdBy ?? DEFAULT_USER_ID, Validators.required],
    });

    if (existing?.oid) {
      (group as FormGroup<any>).addControl('oid', this.fb.control(existing.oid));
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
        this.toast.showToast('Question created — now link answers', 'success');
      },
      error: (err) => {
        this.toast.showToast('Failed to create question', 'error');
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
      orderNo: String(question.orderNo),
      questionScore: question.questionScore,
      isActive: question.isActive,
      correctAnswer: question.correctAnswer,
      question: question.question,
      correctChoiceOid: null,
      createdBy: question.createdBy,
    });
  }

  private populateAnswersOrDragItems(question: any): void {
    if (question.questionTypeName === 'True/False' || question.questionTypeName === 'Multiple Choice Question') {
      const answerControls = question.answers?.map((a: any) => this.createAnswerGroup(false, a)) ?? [];
      this.form.setControl('answers', this.fb.array(answerControls));
    } else {
      console.log('question',question);
      const questions = question.answers?.filter((a: any) => a.question_Ask) ?? [];
      const answers = question.answers?.filter((a: any) => !a.question_Ask) ?? [];

      this.form.setControl('dragQuestions', this.fb.array(
        questions.map((q: any) => this.createDragQuestionGroup(q))
      ));

      this.form.setControl('dragAnswers', this.fb.array(
        answers.map((a: any) => this.createDragAnswerGroup(a))
      ));
      this.addDragAnswersFlag.set(true);
      this.apiAnswers.set(answers);
      console.log('questions',questions);
      this.dragQuestionsArray.controls.forEach((ctrl, index) => {
        const originalQuestion = questions[index];
        if (originalQuestion?.correctAnswerOid) {
          ctrl.patchValue({
            correctAnswerOid: originalQuestion.correctAnswerOid
          });
        }
      });
      this.linkDragAnswerAndQuestionFlag.set(true);
    }
  }

  // Submit / Cancel
  onSubmit(): void {
    if (this.selectedType()?.toLowerCase() === 'matching' && !this.editMode) {
      this.answersArray.clear();
    }

    console.log('Form invalid?', this.form.invalid);
    console.log('Form value:', this.form.value);

    if (this.form.invalid) {
      this.logAllInvalidControls();
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    console.log('payload',payload);
    console.log('edit mode',this.editMode);
    if (!this.editMode) {
      console.log('selectedType',this.selectedType())
      if (this.selectedType() !== 'MATCHING') {
        this.questionStore.addQuestion(payload);
      } else {
        console.log('subit deag questions');
        this.updateMatchingQuestions();
      }
    } else {
      this.updateExistingQuestionAndAnswers();
    }
  }

  cancel(): void {
    this.form.reset();
    this.form.markAsUntouched();
    this.location.back();
  }

  // Payload Builders
  private buildBasePayload(raw: any) {
    return {
      coursesMasterExamOid: raw.coursesMasterExamOid,
      questionText: raw.questionText,
      questionTypeLookupId: raw.questionTypeLookupId,
      questionScore: raw.questionScore,
      orderNo: raw.orderNo,
      isActive: raw.isActive,
      correctAnswer: raw.correctAnswer,
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
      question_Ask: overrides.question_Ask ?? a.question_Ask ?? false,
      correctAnswerOid: a.correctAnswerOid ?? null,
      isCorrect: overrides.isCorrect ?? a.isCorrect ?? false,
      orderNo: a.orderNo,
      createdBy: a.createdBy,
    }));
  }

  private getDragQuestionPayload() {
    const raw = this.form.getRawValue();

    const questionAnswers = this.mapAnswers(raw.dragQuestions, {
      question_Ask: true,
      isCorrect: false,
    });

    const dragAnswers = this.mapAnswers(raw.dragAnswers, {
      question_Ask: false,
    });

    return {
      oid: this.questionId || undefined,
      ...this.buildBasePayload(raw),
      answers: [...questionAnswers, ...dragAnswers],
    };
  }

  private buildPayload(): any {
    const raw = this.form.getRawValue();

    if (this.selectedType() === 'MATCHING') {
      return this.getDragQuestionPayload();
    }

    return {
      oid: this.questionId || undefined,
      ...this.buildBasePayload(raw),
      answers: this.mapAnswers(raw.answers || [], { question_Ask: false }),
    };
  }

  private updateMatchingQuestions(): void {
    const questions = this.dragQuestionsArray.controls.map(c => c.getRawValue());

    from(questions).pipe(
      concatMap((q, index) => {
        const original = this.question()?.answers?.filter(a => a.question_Ask)?.[index];
        console.log('original', original);
        if (!original?.oid) return of(null);

        const payload = {
          oid: original.oid,
          questionId: this.questionId,
          answerText: q.answerText,
          question_Ask: true,
          correctAnswerOid: q.correctAnswerOid ?? null,
          isCorrect: q.isCorrect ?? false,
          orderNo: q.orderNo,
          updatedBy: DEFAULT_USER_ID
        };
       console.log('submit payload',payload);
        this.questionStore.updateQuestion({ id: payload.oid, body: payload });
        return of(null);
      })
    ).subscribe({
      complete: () => {
        this.toast.showToast('Matching questions updated successfully', 'success');
        this.location.back();
      },
      error: (err) => {
        console.error('Batch update failed', err);
        this.toast.showToast('Failed to update matching questions', 'error');
      }
    });
  }

  private updateExistingQuestionAndAnswers(): void {
    const raw = this.form.getRawValue();
    const answers = raw.answers ?? [];

    const toUpdate = answers
      .filter((a: any) => a.oid)
      .map((a: any) => ({
        ...a,
        questionId: this.questionId,
        updatedBy: DEFAULT_USER_ID,
        updatedAt: new Date().toISOString(),
      }));

    const toCreate = answers
      .filter((a: any) => !a.oid)
      .map((a: any) => ({
        ...a,
        questionId: this.questionId,
      }));

    const operations = [
      ...toUpdate.map(a => this.questionStore.updateQuestion$({ id: a.oid, body: a })
        .pipe(catchError(() => of(null)))),
      ...toCreate.map(a => this.questionStore.addAnswer$(a)
        .pipe(catchError(() => of(null))))
    ];

    forkJoin(operations).subscribe(results => {
      const failed = results.filter(r => r === null).length;
      if (failed > 0) {
        this.toast.showToast(`${failed} operation(s) failed`, 'warning');
      } else {
        this.toast.showToast('Question updated successfully', 'success');
        this.location.back();
      }
    });
  }

  private logAllInvalidControls() {
    const invalid: { path: string; errors: any; value: any }[] = [];

    const traverse = (control: AbstractControl, path: string = '') => {
      if (control.invalid) {
        invalid.push({
          path: path || '(root)',
          errors: control.errors,
          value: control.value
        });
      }

      if (control instanceof FormGroup) {
        Object.entries(control.controls).forEach(([key, child]) => {
          traverse(child, path ? `${path}.${key}` : key);
        });
      } else if (control instanceof FormArray) {
        control.controls.forEach((child, idx) => {
          traverse(child, path ? `${path}[${idx}]` : `${idx}`);
        });
      }
    };

    traverse(this.form);

    if (invalid.length === 0) {
      console.log('No invalid controls found');
    } else {
      console.table(invalid);
    }
  }
}
