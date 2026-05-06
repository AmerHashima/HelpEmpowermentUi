import { Component } from '@angular/core';
import { EnrollFormComponent } from '../enroll-form/enroll-form.component';
import { ServiceTitleComponent } from '../service-title/service-title.component';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { ServicePointComponent } from '../service-point/service-point.component';
import { ServicesPageComponent } from '../services-page/services-page.component';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-pmis',
  standalone:true,
  imports: [EnrollFormComponent,ServiceTitleComponent,ServiceCardComponent,
    ServicePointComponent,ServicesPageComponent,TranslateModule,TranslatePipe
  ],
  templateUrl: './pmis.component.html',
  styleUrl: './pmis.component.scss'
})
export class PMISComponent {

constructor(private translate: TranslateService) {
}
  servicePmisCardsInfo = [
    {
      icon: "bi bi-nut",
      header: "pmis.cards.custom.header",
      text: "pmis.cards.custom.text",
    },
    {
      icon: "bi bi-bar-chart-fill",
      header: "pmis.cards.dashboard.header",
      text: "pmis.cards.dashboard.text",
    },
    {
      icon: "bi bi-gear-fill",
      header: "pmis.cards.integration.header",
      text: "pmis.cards.integration.text",
    },
    {
      icon: "bi bi-ethernet",
      header: "pmis.cards.connectivity.header",
      text: "pmis.cards.connectivity.text",
    },
    {
      icon: "bi bi-mortarboard-fill",
      header: "pmis.cards.training.header",
      text: "pmis.cards.training.text",
    },
  ];

  keyBenfits = [
    {
      icon: "bi bi-bar-chart-fill",
      text: "pmis.benefits.tracking",
    },
    {
      icon: "bi bi-flag-fill",
      text: "pmis.benefits.reporting",
    },
    {
      icon: "bi bi-calendar-range-fill",
      text: "pmis.benefits.time",
    },
  ];

}
