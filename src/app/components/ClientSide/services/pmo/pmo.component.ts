import { Component } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ServicesPageComponent } from '../services-page/services-page.component';
import { EnrollFormComponent } from '../enroll-form/enroll-form.component';
import { ServiceTitleComponent } from '../service-title/service-title.component';
import { ServicePointComponent } from '../service-point/service-point.component';
import { ServiceCardComponent } from '../service-card/service-card.component';

@Component({
  selector: 'app-pmo',
  imports: [TranslateModule,TranslatePipe,ServicesPageComponent,EnrollFormComponent,
    ServiceTitleComponent,ServicePointComponent,ServiceCardComponent
  ],
  templateUrl: './pmo.component.html',
  styleUrl: './pmo.component.scss'
})
export class PmoComponent {
  pmoCardsInfo=[
    {
      icon: "bi bi-compass",
      header: "Success Rates and Effectiveness",
      text: "Project success rates improve by 71% in organizations with an effective PMO.",
      source:
        'Source: The "Pulse of the Profession" study by the Project Management Institute (PMI).',
    },
    {
      icon: "bi bi-bar-chart",
      header: "Adherence to Budget and Schedule",
      text: "64% of projects are completed within the allocated budget in organizations with a PMO, and on-time project completion improves by 58%.",
      source: 'Source: The "The State of the PMO" report by PwC.',
    },
    {
      icon: "bi bi-nut",
      header: "Return on Investment (ROI) and Strategic Alignment",
      text: "52% increase in the alignment of projects with the organization's strategic goals and a 45% improvement in project ROI.",
      source: "Source: Research from PMI and Gartner.",
    },
    {
      icon: "bi bi-diagram-3-fill",
      header: "Adoption and Strategic Importance",
      text: "85% of major global companies have a PMO, and 78% of successful organizations define the PMO as a critical factor for their success.",
      source: 'Source: The "The Value of PMO" survey by PM Solutions Research.',
    },
    {
      icon: "bi bi-mortarboard-fill",
      header: "Financial Return on Investment in a PMO",
      text: "We train your teams On average, for every $1 invested in a PMO, the return is $2.50, and the failure rate of major projects decreases by 55%. maximize the system's potential",
      source: 'Source: The "The ROI of PMO" study by the PM World Journal.',
    },
  ]
}
