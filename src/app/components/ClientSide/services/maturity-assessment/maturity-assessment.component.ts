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
      header: "assessment.cards.strengths.header",
      text: "assessment.cards.strengths.text",
    },
    {
      icon: "bi bi-nut",
      header: "assessment.cards.improvement.header",
      text: "assessment.cards.improvement.text",
    },
    {
      icon: "bi bi-nut",
      header: "assessment.cards.baseline.header",
      text: "assessment.cards.baseline.text",
    },
    {
      icon: "bi bi-nut",
      header: "assessment.cards.performance.header",
      text: "assessment.cards.performance.text",
    },
  ];
}
