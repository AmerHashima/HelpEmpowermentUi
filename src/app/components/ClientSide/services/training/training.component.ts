import { Component } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ServicesPageComponent } from '../services-page/services-page.component';
import { ServiceTitleComponent } from '../service-title/service-title.component';
import { EnrollFormComponent } from '../enroll-form/enroll-form.component';

@Component({
  selector: 'app-training',
  imports: [TranslateModule,TranslatePipe,ServicesPageComponent,ServiceTitleComponent,EnrollFormComponent],
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss'
})
export class TrainingComponent {
  examples = [
    {
      icon: "bi bi-bullseye",
      text: "IT Organization Strategy",
    },
    {
      icon: "bi bi-kanban",
      text: "Portfolios, Programs & Projects Management in Constructions",
    },
    {
      icon: "bi bi-diagram-3",
      text: "PMO Vision in government sector",
    },
    {
      icon: "bi bi-graph-up-arrow",
      text: "OKRs & KPIs",
    },
    {
      icon: "bi bi-bar-chart-line",
      text: "Smart Reports and Dashboards",
    },
    {
      icon: "bi bi-gear-wide-connected",
      text: "PMO Methodology",
    },
    {
      icon: "bi bi-journal-check",
      text: "PMO Governance & Templates",
    },
    {
      icon: "bi bi-cash-coin",
      text: "Smart financing (Cashflow in/out – Budgeting)",
    },
    {
      icon: "bi bi-people",
      text: "Capabilities & Capacity Management",
    },
    {
      icon: "bi bi-patch-check",
      text: "Quality Management (QMS)",
    },
    {
      icon: "bi bi-truck",
      text: "Vendor Management",
    },
    {
      icon: "bi bi-mortarboard",
      text: "Feasibility studies",
    },
  ];
}
