import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { CertificationsStore } from '../../../AdminPanelStores/CertificationStore/certification.store';
import { ExamsStore } from '../../../AdminPanelStores/ExamsStore/exam.store';
import { QuestionsStore } from '../../../AdminPanelStores/QuestionStores/questions.store';


@Component({
  selector: 'app-certifications',
  imports: [RouterOutlet],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
  providers: [CertificationsStore,ExamsStore,QuestionsStore]
})
export class CertificationsComponent {
}
