import { Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AsyncPipe, JsonPipe, Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { SpkNgSelectComponent } from '../../../../shared/spk-ng-select/spk-ng-select.component';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { InputComponent } from '../../../../shared/input/input.component';
import { FileUploadComponent } from '../../../../shared/file-upload/file-upload.component';
import { TextareaComponent } from '../../../../shared/text-area/text-area.component';
import { CertificationsStore } from '../../../../AdminPanelStores/CertificationStore/certification.store';
import { CertificationService } from '../../../../Services/certification.service';

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
  private certificationService = inject(CertificationService);
  private certificationStore = inject(CertificationsStore);
  addAnswersFlag = signal<boolean>(true);
  addChoiceAnswersFlag = signal<boolean>(false);
  addDragQuestionsFlag = signal<boolean>(false);
  addDragAnswersFlag = signal<boolean>(false);
  linkDragAnswerAndQuestionFlag = signal<boolean>(false);


  // questionTypes$ = this.certificationService.getQuestionTypes();
  questionTypes:any[]=[];
  certifications = this.certificationStore.certifications;
  certification=this.certificationStore.selectedCertification;
  certificationId = this.route.snapshot.paramMap.get('id');
  examId = this.route.snapshot.paramMap.get('examId');



  exams$ = this.certificationService.getCertificationExams(this.certificationId!).pipe(
    map(exams => (exams ?? []).map((exam, idx) => ({
      ...exam,
      indexLabel: `${idx + 1}`
    })))
  );

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
    correctAnswer: [false, Validators.required],
    question: [false, Validators.required],
    correctChoiceOid: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', Validators.required],
    // files: [[] as File[]],
    createdBy: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', Validators.required],
    answers: this.fb.array([this.createAnswerGroup()]),
    dragQuestions: this.fb.array([this.createDragQuestionGroup()]),
    dragAnswers: this.fb.array([this.createDragAnswerGroup()]),
    correctDragAnswer: [[]]
  });

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
  }
  private choiceAnswerOrderCounter = 0;

  createAnswerGroup(): FormGroup {
    const group = this.fb.group({
      isCorrect: [false],
      answerText: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
      ],
      orderNo: [this.choiceAnswerOrderCounter, Validators.required],
      createdBy: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', Validators.required],
    });

    this.choiceAnswerOrderCounter++;
    return group;
  }


  createDragQuestionGroup(): FormGroup {
    return this.fb.group({
      dragQuestion: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
      ],
      correctDragAnswer: [
        '',
        Validators.required
      ],
    });
  }
  createDragAnswerGroup(): FormGroup {
    return this.fb.group({
      dragAnswer: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
      ],
    });
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

  get dragAnswers() {
    //get answers from api
    return [
      {
        label: "answer 1", value: "1",
      }, {
        label: "answer 2", value: "2",
      }
    ]
  }
  get dragQuestions() {
    //get answers from api
    return [
      {
        label: "question 1", value: "1",
      }, {
        label: "question 2", value: "2",
      }
    ]
  }

  onAddAnotherAnswerSection(): void {
    // send api calls
    this.answersArray.push(this.createAnswerGroup());
  }

  onAddAnotherDragQuestion(): void {
    // send api calls
    this.dragQuestionsArray.push(this.createDragQuestionGroup());
  }
  onAddAnotherDragAnswer(): void {
    // send api calls
    this.dragAnswersArray.push(this.createDragAnswerGroup());
  }

  removeAnswer(index: number): void {
    //send api call to delete answer
    this.answersArray.removeAt(index);
  }
  removeDragQuestion(index: number): void {
    //send api call to delete question
    this.dragQuestionsArray.removeAt(index);
  }
  removeDragAnswer(index: number): void {
    //send api call to delete question
    this.dragAnswersArray.removeAt(index);
  }

  DoneWithDragQuestion() {
    this.addDragAnswersFlag.set(true);
  }

  DoneWithDragAnswer() {
    this.linkDragAnswerAndQuestionFlag.set(true);
  }

  onAddNewCertification() {

  }

  onActivateAddAnswerSection() {
    // Reset all flags
    this.addAnswersFlag.set(false);
    this.addChoiceAnswersFlag.set(false);
    this.addDragQuestionsFlag.set(false);

    const selectedOid = this.form.value.questionTypeLookupId;
    if (!selectedOid) return;

    const selectedType = this.questionTypes?.find(q => q.oid === selectedOid);

    if (!selectedType) return;

    // Check the lookupValue to decide which flag to set
    switch (selectedType.lookupValue) {
      case 'MCQ':
        this.addChoiceAnswersFlag.set(true);
        break;
      case 'TRUE_FALSE':
        this.addChoiceAnswersFlag.set(true);
        break;
      default:
        this.addDragQuestionsFlag.set(true);
        break;
    }
  }
  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.location.back();
  }
  onSubmit() {
    const payload = this.getChoicePayload();
    this.certificationService.createQuestion(payload).subscribe({
      next:(value) =>{
        console.log('Question created successfully:', value);
        this.location.back();
      },
    });
  }

  getChoicePayload() {
    const raw = this.form.getRawValue();

    const payload = {
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
      answers: raw.answers.map((a: any, i: number) => ({
        answerText: a.answerText,
        isCorrect: a.isCorrect,
        orderNo: a.orderNo,
        createdBy: a.createdBy,
      })),
    };

    return payload;
  }
}



