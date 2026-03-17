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
  pmoCardsInfo = [
    {
      icon: "bi bi-compass",
      header: "pmo.cards.success.header",
      text: "pmo.cards.success.text",
      source: "pmo.cards.success.source",
    },
    {
      icon: "bi bi-bar-chart",
      header: "pmo.cards.budget.header",
      text: "pmo.cards.budget.text",
      source: "pmo.cards.budget.source",
    },
    {
      icon: "bi bi-nut",
      header: "pmo.cards.roi.header",
      text: "pmo.cards.roi.text",
      source: "pmo.cards.roi.source",
    },
    {
      icon: "bi bi-diagram-3-fill",
      header: "pmo.cards.adoption.header",
      text: "pmo.cards.adoption.text",
      source: "pmo.cards.adoption.source",
    },
    {
      icon: "bi bi-mortarboard-fill",
      header: "pmo.cards.financial.header",
      text: "pmo.cards.financial.text",
      source: "pmo.cards.financial.source",
    },
  ];
}
