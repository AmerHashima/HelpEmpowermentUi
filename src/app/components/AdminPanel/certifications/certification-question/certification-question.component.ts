import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, JsonPipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, defer, EMPTY, from, map } from 'rxjs';
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

@Component({
  selector: 'app-certification-question',
  imports: [SpkNgSelectComponent, ButtonComponent, InputComponent,
    FileUploadComponent, ReactiveFormsModule, AsyncPipe, JsonPipe,
    TextareaComponent],
  templateUrl: './certification-question.component.html',
  styleUrl: './certification-question.component.scss'
})
export class CertificationQuestionComponent {
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private store = inject(CertificationsStore);
  private examsStore = inject(ExamsStore);
  private questionStore = inject(QuestionsStore);
  private certificationService = inject(CertificationService);
  private certificationStore = inject(CertificationsStore);
  private toast = inject(ToastingMessagesService);
  private router = inject(Router);
  addAnswersFlag = signal<boolean>(true);
  addChoiceAnswersFlag = signal<boolean>(false);
  addDragQuestionsFlag = signal<boolean>(false);
  addDragAnswersFlag = signal<boolean>(false);
  linkDragAnswerAndQuestionFlag = signal<boolean>(false);
  questionTypes: any[] = [];
  editMode: boolean = false;
  selectedType = signal<'MCQ' | 'TRUE_FALSE' | 'MATCHING' | null>(null);;
  requestPayload = signal<any>({});
  activeSection = signal<'MCQ' | 'TRUE_FALSE' | 'MATCHING' | 'True/False' | "Multiple Choice Question" | 'Matching' | null>(null);
  certifications = this.certificationStore.certifications;
  certification = this.certificationStore.selectedCertification;
  certificationId = this.route.snapshot.paramMap.get('id');
  examId = this.route.snapshot.paramMap.get('examId');



  exams = computed(() => {
    return this.examsStore.exams().map((exam, idx) => ({
      ...exam,
      indexLabel: `${idx + 1}`,
    }));
  });
  questionMarks = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },

  ];

  examModes$ = this.certificationService.getExamModes();

  status = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];

  fb = inject(FormBuilder);
  form = this.fb.group({
    certification: ['', Validators.required],
    coursesMasterExamOid: ['', Validators.required],
    examMode: [''],
    questionTypeLookupId: ['', Validators.required],
    questionText: ['', Validators.required],
    orderNo: ['', Validators.required],
    questionScore: [0, Validators.required],
    isActive: [true, Validators.required],
    correctAnswer: [true, Validators.required],
    question: [true, Validators.required],
    // correctChoiceOid: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', Validators.required],
    correctChoiceOid: [null, Validators.required],
    // files: [[] as File[]],
    createdBy: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', Validators.required],
    answers: this.fb.array([this.createAnswerGroup()]),
    dragQuestions: this.fb.array([this.createDragQuestionGroup()]),
    dragAnswers: this.fb.array([this.createDragAnswerGroup()]),
    correctDragAnswer: [[]]
  });
  apiAnswers = [];
  apiQuestions: any[] = [];
  private choiceAnswerOrderCounter = 0;
  questionId = '';
  question = computed(() => this.questionStore.selectedQuestion());
  constructor() {
    this.certificationService.getQuestionTypes().subscribe(types => {
      this.questionTypes = types;
    })

    effect(() => {
      if (this.certificationId && !this.certification()) {
        this.store.getCertification(this.certificationId);
      }
    });

    effect(() => {
      this.questionId = this.route.snapshot.paramMap.get('questionId')!;
      console.log('questionId', this.questionId);
      console.log('this.question()', this.question());
      if (!this.question() && this.questionId) {
        console.log('on get qyestion')
        console.log('questionId', this.questionId);
        this.questionStore.getQuestion(this.questionId);
      }
    });

    effect(() => {
      const question = this.question();

      // ← Exit early if no question (very important!)
      if (!question) {
        console.log("No question yet → skipping");
        return;
      }

      // Add this line to see how many times we actually process a question
      console.log("Processing question:", question.oid || "no-id", "— answers count:", question.answers?.length);

      this.editMode = true;               // ← or .set(true) if it's a signal
      this.choiceAnswerOrderCounter = 0;

      // Patch the simple fields (you can keep your existing patchValue)
      this.form.patchValue({
        certification: this.certification()?.oid,
        coursesMasterExamOid: question.coursesMasterExamOid,
        examMode: '',
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

      // ───────────────────────────────────────────────
      //   DRAG-DROP PART — only build arrays here
      // ───────────────────────────────────────────────
      if (question.questionTypeName !== 'True/False' && question.questionTypeName !== 'Multiple Choice Question') {

        const questions = question.answers?.filter(a => a.question_Ask) ?? [];
        const answers = question.answers?.filter(a => !a.question_Ask) ?? [];

        console.log("Filtered questions:", questions.length);
        console.log("Filtered answers  :", answers.length);

        const dragQuestions = this.fb.array(
          questions.map(a => this.createGroup(true, a.correctAnswerOid, a))
        );

        const dragAnswers = this.fb.array(
          answers.map(a => this.createGroup(false, null, a))
        );

        console.log("dragQuestions controls:", dragQuestions.length);
        console.log("dragAnswers controls  :", dragAnswers.length);

        this.form.setControl('dragQuestions', dragQuestions);
        this.form.setControl('dragAnswers', dragAnswers);

        this.addDragAnswersFlag.set(true);
      } else {
        const answersArray = this.fb.array(
          question.answers?.map(a => this.createGroup(false, null, a))
        );
        this.form.setControl('answers', answersArray);
      }

      this.activeSection.set(question.questionTypeName as any);
    }

    );

    //     effect(() => {
    //       const question = this.question();
    //       if (question) {
    //         this.editMode=true;
    //         // Reset counter for correct orderNo assignment
    //         console.log('question.answers',question.answers);
    //         this.choiceAnswerOrderCounter = 0;
    //         // Build answers arra


    //         // Patch form
    //         this.form.patchValue({
    //           certification: this.certification()?.oid,
    //           coursesMasterExamOid: question.coursesMasterExamOid,
    //           examMode: '',
    //           questionTypeLookupId: question.questionTypeLookupId,
    //           questionText: question.questionText,
    //           orderNo: String(question.orderNo),
    //           questionScore: question.questionScore,
    //           isActive: question.isActive,
    //           correctAnswer: question.correctAnswer,
    //           question: question.question,
    //           correctChoiceOid: null,
    //           createdBy: question.createdBy,
    //         });

    //         // Replace form arrays


    //         if (question.questionTypeName == 'True/False' || question.questionTypeName == "Multiple Choice Question") {
    //           // createGroup(question: boolean, correctAnswerOid ?: string, existingAnswer ?: any): FormGroup {

    //           const answersArray = this.fb.array(
    //             question.answers?.map(a => this.createGroup(false, null, a))
    //           );
    //           this.form.setControl('answers', answersArray);
    //         } else {
    //           const dragQuestions = this.fb.array(
    //             question.answers?.filter(a => a.question_Ask).map(a => this.createGroup(true, a.correctAnswerOid, a))
    //           );
    //           this.form.setControl('dragQuestions', dragQuestions);
    //           const dragAnswers = this.fb.array(
    //             question.answers?.filter(a => !a.question_Ask).map(a => this.createGroup(false, null, a))
    //           );
    //           console.log(question.answers?.filter(a => !a.question_Ask).map(a => this.createGroup(false, null, a))
    // );
    //           console.log(question.answers?.filter(a => a.question_Ask).map(a => this.createGroup(true, a.correctAnswerOid, a)));
    //           console.log('dragAnswers', dragAnswers);
    //           console.log('dragQuestions', dragQuestions);

    //           this.form.setControl('dragAnswers', dragAnswers);
    //           this.addDragAnswersFlag.set(true);
    //           // this.linkDragAnswerAndQuestionFlag.set(true);
    //         }

    //         // Same for drag questions/answers if needed
    //         // this.form.setControl('dragQuestions', ...)
    //         // this.form.setControl('dragAnswers', ...)

    //         this.activeSection.set(question.questionTypeName as any);

    //         // Set the active section
    //         // this.activeSection.set(question.questionTypeName as any);
    //       }
    //     });

    effect(() => {
      const certification = this.certification();
      if (!certification?.oid) return;
      this.form.patchValue({
        certification: certification.oid,
        coursesMasterExamOid: this.examId
      });
    });

    effect(() => {
      const success = this.store.success();
      if (success)
        this.cancel();
      this.store.setSuccess(false);
    });

    effect(() => {
      const success = this.questionStore.success();
      if (success) {
        this.toast.showToast('Question created successfully', 'success');
        console.log('Question created successfully:');
        this.cancel();
        this.questionStore.setSuccess(false);
        this.router.navigate(['/admin/certifications', this.certification()?.oid!, 'exams', 'exam', this.examId]);

        // this.location.back();
      }
    });

    effect(() => {
      console.log('on select reset');
      const type = this.selectedType();
      if (this.editMode) return;
      switch (type) {
        case 'MCQ':
          this.resetChoiceState();
          break;
        case 'TRUE_FALSE':
          this.resetChoiceState();
          break;
        default:
          this.resetMatchingState();
      }
    });

  }



  // createGroup(question: boolean, correctAnswerOid?:string): FormGroup {
  //   const group = this.fb.group({
  //     answerText: [
  //       '',
  //       [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
  //     ],
  //     question_Ask: [question],
  //     correctAnswerOid: [correctAnswerOid ?correctAnswerOid:null, Validators.required],
  //     isCorrect: [false],
  //     orderNo: [this.choiceAnswerOrderCounter, Validators.required],
  //     createdBy: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', Validators.required],
  //   });

  //   this.choiceAnswerOrderCounter++;
  //   return group;
  // }
  createGroup(question: boolean, correctAnswerOid?: any, existingAnswer?: any): FormGroup {
    const group = this.fb.group({
      answerText: [
        existingAnswer?.answerText || '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
      ],
      question_Ask: [existingAnswer?.question_Ask ?? question],
      correctAnswerOid: [existingAnswer?.correctAnswerOid ?? (correctAnswerOid ?? null), Validators.required],
      isCorrect: [existingAnswer?.isCorrect ?? false],
      orderNo: [existingAnswer?.orderNo ?? this.choiceAnswerOrderCounter, Validators.required],
      createdBy: [existingAnswer?.createdBy || '3fa85f64-5717-4562-b3fc-2c963f66afa6', Validators.required],
    });

    this.choiceAnswerOrderCounter++;
    return group;
  }
  createAnswerGroup(): FormGroup {
    return this.createGroup(false);
  }
  createDragQuestionGroup(): FormGroup {
    return this.createGroup(true);
  }
  createDragAnswerGroup(): FormGroup {
    return this.createGroup(false);
  }

  get answersArray(): FormArray {
    return this.form.get('answers') as FormArray;
  }
  get dragQuestionsArray(): FormArray {
    return this.form.get('dragQuestions') as FormArray;
  }

  get dragAnswersArray(): FormArray {
    return this.form.get('dragAnswers') as FormArray;
  }

  onAddAnotherAnswerSection(): void {
    this.answersArray.push(this.createAnswerGroup());
  }

  onAddAnotherDragQuestion(): void {
    this.dragQuestionsArray.push(this.createDragQuestionGroup());
  }
  onAddAnotherDragAnswer(): void {
    this.dragAnswersArray.push(this.createDragAnswerGroup());
  }

  removeAnswer(index: number): void {
    this.answersArray.removeAt(index);
  }

  removeDragQuestion(index: number): void {
    this.dragQuestionsArray.removeAt(index);
  }
  removeDragAnswer(index: number): void {
    this.dragAnswersArray.removeAt(index);
  }

  DoneWithDragQuestion() {
    this.addDragAnswersFlag.set(true);
  }

  DoneWithDragAnswer() {
    // const payload = this.getDragAnswerPayload();    const payload = this.getDragAnswerPayload();
    const payload = this.getDragQuestionPayload();
    this.certificationService.createQuestion(payload).subscribe({
      next: (response) => {
        this.questionId = response.oid;
        this.apiQuestions = response.answers.filter((answer: any) => answer.question_Ask);
        this.apiAnswers = response.answers.filter((answer: any) => !answer.question_Ask);
        console.log('apiAnswers', this.apiAnswers)
        console.log('apiQuestions', this.apiQuestions)
        this.linkDragAnswerAndQuestionFlag.set(true);
      },
    });
  }

  onActivateAddAnswerSection() {
    this.activeSection.set(this.selectedType());
  }

  onSubmit() {
    const payload = this.getPayload();
    if (this.selectedType() != 'MATCHING') this.questionStore.addQuestion(payload);
    else {
      const questionsWithAnswers = this.getUpdateQuestionPayload();
      from(questionsWithAnswers)
        .pipe(
          concatMap(q =>
            this.questionStore.updateQuestion({ id: q.oid, body: q }) && EMPTY
          )
        )
        .subscribe({
          complete: () => {
            this.toast.showToast('All questions updated successfully', 'success');
            this.location.back();
          }
        });
    }

  }

  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.location.back();
  }

  getPayload() {
    switch (this.selectedType()) {
      case 'MCQ':
        return this.getChoicePayload();
      case 'TRUE_FALSE':
        return this.getChoicePayload();
      default:
        return this.getDragQuestionPayload()
    }
  }


  getChoicePayload() {
    const raw = this.form.getRawValue();

    return {
      ...this.buildBasePayload(raw),
      answers: this.mapAnswers(raw.answers),
    };
  }

  getDragQuestionPayload() {
    const raw = this.form.getRawValue();
    const questionAnswers = this.mapAnswers(raw.dragQuestions, {
      question_Ask: true,
      isCorrect: false,
    });

    return {
      oid: this.questionId,
      ...this.buildBasePayload(raw),
      // answers: [...questionAnswers, ...this.apiAnswers],
      answers: [...questionAnswers, ...this.mapAnswers(raw.dragAnswers)],

    };
  }

  getUpdateQuestionPayload() {
    const raw = this.form.getRawValue();
    return raw.dragQuestions.map((a: any, index: number) => ({
      oid: this.apiQuestions[index].oid,
      questionId: this.questionId,
      answerText: a.answerText,
      question_Ask: true,
      correctAnswerOid: a.correctAnswerOid,
      isCorrect: a.isCorrect,
      orderNo: a.orderNo,
      updatedBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }));
  }


  // getDragAnswerPayload() {
  //   const raw = this.form.getRawValue();

  //   return {
  //     ...this.buildBasePayload(raw),
  //     answers: this.mapAnswers(raw.dragAnswers),
  //   };
  // }

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
    overrides?: Partial<{
      question_Ask: boolean;
      isCorrect: boolean;
    }>
  ) {
    return source.map((a: any) => ({
      answerText: a.answerText,
      question_Ask: overrides?.question_Ask ?? a.question_Ask,
      correctAnswerOid: a.correctAnswerOid ?? null,
      isCorrect: overrides?.isCorrect ?? a.isCorrect ?? false,
      orderNo: a.orderNo,
      createdBy: a.createdBy,
    }));
  }
  onSelectedQuestionType(questionType: any) {
    const type = (this.questionTypes.filter(question => question.oid == questionType))[0];
    this.selectedType.set(type.lookupValue);
    this.onActivateAddAnswerSection();
  }

  private resetMatchingState() {
    // reset flags
    this.addDragQuestionsFlag.set(false);
    this.addDragAnswersFlag.set(false);
    this.linkDragAnswerAndQuestionFlag.set(false);

    // clear form arrays
    this.dragQuestionsArray.clear();
    this.dragAnswersArray.clear();

    // re-add one default item
    this.dragQuestionsArray.push(this.createDragQuestionGroup());
    this.dragAnswersArray.push(this.createDragAnswerGroup());
    // reset counter if needed
    this.choiceAnswerOrderCounter = 0;
  }
  private resetChoiceState() {
    // clear form arrays
    this.answersArray.clear();
    // re-add one default item
    this.answersArray.push(this.createAnswerGroup());
    // reset counter if needed
    this.choiceAnswerOrderCounter = 0;
  }
}



