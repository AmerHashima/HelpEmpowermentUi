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
    FileUploadComponent, ReactiveFormsModule,AsyncPipe,JsonPipe,
    TextareaComponent],
  templateUrl: './certification-question.component.html',
  styleUrl: './certification-question.component.scss'
})
export class CertificationQuestionComponent {
  private location = inject(Location);
  private route=inject(ActivatedRoute);
  private store = inject(CertificationsStore);
  private examsStore=inject(ExamsStore);
  private questionStore=inject(QuestionsStore);
  private certificationService = inject(CertificationService);
  private certificationStore = inject(CertificationsStore);
  private toast=inject(ToastingMessagesService);
  private router=inject(Router);
  addAnswersFlag = signal<boolean>(true);
  addChoiceAnswersFlag = signal<boolean>(false);
  addDragQuestionsFlag = signal<boolean>(false);
  addDragAnswersFlag = signal<boolean>(false);
  linkDragAnswerAndQuestionFlag = signal<boolean>(false);


  questionTypes:any[]=[];
  selectedType= signal<'MCQ' | 'TRUE_FALSE' | 'MATCHING'|null>(null);;
  requestPayload = signal<any>({});
  activeSection = signal<'MCQ' | 'TRUE_FALSE' | 'MATCHING' | 'True/False' | "Multiple Choice Question" |null>(null);
  certifications = this.certificationStore.certifications;
  certification=this.certificationStore.selectedCertification;
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
    isActive:[true, Validators.required],
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
  apiQuestions:any[]=[];
  private choiceAnswerOrderCounter = 0;
  private questionId = '';
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


    // effect(() => {
    //   const question = this.question();
    //   console.log('question', question);
    //   if (question && question.oid) {
    //     console.log('in paych')
    //     this.form.patchValue({
    //       certification: this.certification()?.oid,
    //       coursesMasterExamOid: question.coursesMasterExamOid,
    //       examMode:'',
    //       questionTypeLookupId: question.questionTypeLookupId,
    //       questionText: question.questionText,
    //       orderNo: String(question.orderNo),
    //       questionScore: question.questionScore,
    //       isActive: question.isActive,
    //       correctAnswer: question.correctAnswer,
    //       question: question.question,
    //       correctChoiceOid:  null,
    //       // files: [[] as File[]],
    //       createdBy: question.createdBy,
    //       answers: question.answers,
    //       dragQuestions: [],
    //       dragAnswers: []
    //     });
    //     this.activeSection.set(question.questionTypeName);
    //   }
    // });


    effect(() => {
      const question = this.question();
      if (question) {
        // Reset counter for correct orderNo assignment
        this.choiceAnswerOrderCounter = 0;

        // Build answers array
        const answersArray = this.fb.array(
          question.answers?.map(a => this.createGroup(false, a.correctAnswerOid, a)) || [this.createGroup(false)]
        );

        // Patch form
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

        // Replace form arrays
        this.form.setControl('answers', answersArray);

        // Same for drag questions/answers if needed
        // this.form.setControl('dragQuestions', ...)
        // this.form.setControl('dragAnswers', ...)

        // Set the active section
        this.activeSection.set(question.questionTypeName as any);
      }
    });

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
      if (success)
      {
        this.toast.showToast('Question created successfully', 'success');
        console.log('Question created successfully:');
        this.cancel();
        this.questionStore.setSuccess(false);
        this.router.navigate(['/admin/certifications', this.certification()?.oid!, 'exams', 'exam',this.examId]);

        // this.location.back();
      }
    });

    effect(() => {
      const type = this.selectedType();
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
  createGroup(question: boolean, correctAnswerOid?: string, existingAnswer?: any): FormGroup {
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
    console.log('new payload', payload);
    this.certificationService.createQuestion(payload).subscribe({
      next: (response) => {
        this.questionId=response.oid;
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
    else{
      const questionsWithAnswers = this.getUpdateQuestionPayload();
      console.log(questionsWithAnswers);

      // Replace your entire from().pipe().subscribe() block with:
      // from(questionsWithAnswers)
      //   .pipe(
      //     concatMap((q) =>
      //       defer(() =>
      //         this.questionStore.updateQuestion({ id: q.oid, body: q })  // ← RETURN the Observable!
      //           .pipe(
      //             catchError((err) => {
      //               console.error(`Failed ${q.oid}:`, err);
      //               return EMPTY;  // Continue to next, don't stop batch
      //             })
      //           )
      //       )
      //     )
      //   )
      //   .subscribe({
      //     complete: () => {
      //       this.toast.showToast('All questions updated successfully', 'success');
      //       this.location.back();
      //     },
      //     error: (err) => {
      //       this.toast.showToast('Batch update failed', 'error');
      //       console.error('Final error:', err);
      //     }
      //   });
      from(questionsWithAnswers)
        .pipe(
          concatMap(q =>
            // Trigger the rxMethod side-effect (fire & forget per item)
            this.questionStore.updateQuestion({ id: q.oid, body: q }) && EMPTY
          )
        )
        .subscribe({
          complete: () => {
            this.toast.showToast('All questions updated successfully', 'success');
            this.location.back();
          }
        });
      // this.questionStore.updateQuestion({ id: this.questionId, body: payload })

    }

  }

  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.location.back();
  }

  getPayload(){
    switch (this.selectedType()) {
      case 'MCQ':
        return this.getChoicePayload();
      case 'TRUE_FALSE':
        return this.getChoicePayload();
      default:
        // return this.getUpdateQuestionPayload();
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
    return raw.dragQuestions.map((a: any,index:number) => ({
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


  getDragAnswerPayload() {
    const raw = this.form.getRawValue();

    return {
      ...this.buildBasePayload(raw),
      answers: this.mapAnswers(raw.dragAnswers),
    };
  }

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
  onSelectedQuestionType(questionType:any){
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



