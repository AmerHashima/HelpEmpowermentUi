// src\app\components\AdminPanel\certification-question\certification-question.component.ts
import { Component, inject, signal } from '@angular/core';
import { SpkNgSelectComponent } from '../../../shared/spk-ng-select/spk-ng-select.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputComponent } from '../../../shared/input/input.component';
import { FileUploadComponent } from '../../../shared/file-upload/file-upload.component';
import { CheckboxComponent, CheckboxOption } from '../../../shared/checkbox/checkbox.component';

@Component({
  selector: 'app-certification-question',
  imports: [SpkNgSelectComponent, ButtonComponent, InputComponent,
    FileUploadComponent, ReactiveFormsModule, CheckboxComponent],
  templateUrl: './certification-question.component.html',
  styleUrl: './certification-question.component.scss'
})
export class CertificationQuestionComponent {
  addAnswersFlag = signal<boolean>(true);
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
  checkboxOptions: CheckboxOption[] = [
    { label: "", value: "true" }
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
    // answer: ['', Validators.required],
    answers: this.fb.array([this.createAnswerGroup()]),
  });

  // 🔹 One row structure
  createAnswerGroup(): FormGroup {
    return this.fb.group({
      answers: [[]],
      answer: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
      ],
    });
  }

  get answersArray(): FormArray {
    return this.form.get('answers') as FormArray;
  }

  onAddAnotherAnswerSection(): void {
    // send api calls
    this.answersArray.push(this.createAnswerGroup());
  }

  removeAnswer(index: number): void {
    this.answersArray.removeAt(index);
  }
  onAddNewCertification() {

  }
  onActivateAddAnswerSection() {
    this.addAnswersFlag.set(false);
  }
  cancel() { }
  onSubmit() { }
}



