import { Component } from '@angular/core';
import { ServicesPageComponent } from '../services-page/services-page.component';
import { ServiceTitleComponent } from '../service-title/service-title.component';
import { ServicePointComponent } from '../service-point/service-point.component';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { EnrollFormComponent } from '../enroll-form/enroll-form.component';

@Component({
  selector: 'app-maturity-assessment',
  imports: [ServicesPageComponent,ServiceTitleComponent,ServicePointComponent,
    ServiceCardComponent,TranslateModule,TranslatePipe,EnrollFormComponent],
  templateUrl: './maturity-assessment.component.html',
  styleUrl: './maturity-assessment.component.scss'
})
export class MaturityAssessmentComponent {
  serviceAssesmentCardsInfo = [
    {
      icon: "bi bi-nut",
      header: "Identifying strengths and weaknesses",
      text: "Assessing current project management practices to identify areas where your organization excels and areas that need improvement.",
    },
    {
      icon: "bi bi-nut",
      header: "Defining improvement strategies",
      text: "Developing strategies and action plans to enhance project management practices and capabilities within the organization",
    },
    {
      icon: "bi bi-nut",
      header: "Establishing a baseline",
      text: "Establishing a benchmark of organization's current project management maturity level to measure progress over time.",
    },
    {
      icon: "bi bi-nut",
      header: "Enhancing project performance",
      text: "Improving project success rates, delivery times, cost-effectiveness, and overall project outcomes by implementing best practices in project management."
    },
  ];
}
