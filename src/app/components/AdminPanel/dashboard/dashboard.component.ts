// src\app\components\AdminPanel\dashboard\dashboard.component.ts
import { Component } from '@angular/core';
import { CertificationQuestionComponent } from '../certification-question/certification-question.component';

@Component({
  selector: 'app-dashboard',
  imports: [CertificationQuestionComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
