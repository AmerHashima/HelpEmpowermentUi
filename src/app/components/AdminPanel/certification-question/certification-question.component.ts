import { Component, inject, signal } from '@angular/core';
import { SpkNgSelectComponent } from '../../../shared/spk-ng-select/spk-ng-select.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputComponent } from '../../../shared/input/input.component';
import { FileUploadComponent } from '../../../shared/file-upload/file-upload.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-certification-question',
  imports: [SpkNgSelectComponent, ButtonComponent, InputComponent,
    FileUploadComponent, ReactiveFormsModule],
  templateUrl: './certification-question.component.html',
  styleUrl: './certification-question.component.scss'
})
export class CertificationQuestionComponent {
  private location = inject(Location);
  addAnswersFlag = signal<boolean>(true);
  addChoiceAnswersFlag = signal<boolean>(false);
  addDragQuestionsFlag = signal<boolean>(false);
  addDragAnswersFlag = signal<boolean>(false);
  linkDragAnswerAndQuestionFlag = signal<boolean>(false);
  certificationOptions = [
    { label: "PMP", value: "PMP" },
    { label: "CAMP", value: "CAMP" }
  ]
  questionTypes = [
    { label: "Single Choice", value: 0 },
    { label: "Muliple Choice", value: 1 },
    { label: "Drag and Drop", value: 2 }

  ]

  examNo = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
    { label: "9", value: 9 },
  ];

  questionMarks = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
    { label: "9", value: 9 },
  ];

  examModes = [
    { label: "Practice Mode", value: "practice" },
    { label: "Exam Mode", value: "exam" }
  ]

  fb = inject(FormBuilder);
  form = this.fb.group({
    certification: ['', Validators.required],
    examNo: ['', Validators.required],
    examMode: ['', Validators.required],
    questionType: [0, Validators.required],
    questionHeader: ['', Validators.required],
    questionOrder: ['', Validators.required],
    questionMark: [0, Validators.required],
    files: [[] as File[]],
    answers: this.fb.array([this.createAnswerGroup()]),
    dragQuestions: this.fb.array([this.createDragQuestionGroup()]),
    dragAnswers: this.fb.array([this.createDragAnswerGroup()]),
    correctDragAnswer: [[]]
  });

  // 🔹 One row structure
  createAnswerGroup(): FormGroup {
    return this.fb.group({
      // answers: [[]],
      correctAnswer: [false],
      answer: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
      ],
    });
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
    this.addAnswersFlag.set(false);
    const questionType = this.form.value.questionType;
    if (questionType == 0 || questionType == 1)
      this.addChoiceAnswersFlag.set(true)
    else this.addDragQuestionsFlag.set(true);
  }
  cancel() {
    this.form.markAsUntouched();
    this.form.reset();
    this.location.back();
  }
  onSubmit() {
    console.log(this.form.value);
  }
}



