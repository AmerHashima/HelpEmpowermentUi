import { Component, computed, inject, input, output, signal } from '@angular/core';
import { APIExam, Certification } from '../../../models/certification';
import { ButtonComponent } from '../../../shared/button/button.component';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { of } from 'rxjs';
import { CertificationService } from '../../../Services/certification.service';

@Component({
  selector: 'app-certification',
  imports: [ButtonComponent, JsonPipe, AsyncPipe],
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.scss'
})
export class CertificationComponent {
  certificationService = inject(CertificationService);
  certification = input<Certification>({} as Certification);
  readonly addNewExamEmitter = output<void>();
  readonly addNewQuestionEmitter = output<any>();

  readonly exams$ = computed(() => {
    const oid = this.certification()?.oid;
    console.log('oid', oid);
    return oid
      ? this.certificationService.getCertificationExams(oid)
      : of([] as APIExam[]);
  });


  onAddNewExam() {
    this.addNewExamEmitter.emit();
  }
  onAddNewQuestion(exam: any) {
    this.addNewQuestionEmitter.emit(exam);
  }
  onDeleteExam(exam: any) { }
}
