// src\app\components\AdminPanel\certification\certification.component.ts
import { Component, input } from '@angular/core';
import { Certification } from '../../../models/certification';
import { ButtonComponent } from '../../../shared/button/button.component';

@Component({
  selector: 'app-certification',
  imports: [ButtonComponent],
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.scss'
})
export class CertificationComponent {
  certification = input<Certification>({} as Certification);
  exams = input<any[]>([1, 2, 3, 4, 5])
  onAddNewExam() {

  }
  onAddNewQuestion(exam: any) { }
  onDeleteExam(exam: any) { }
}
