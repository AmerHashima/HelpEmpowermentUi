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
    { icon: "bi bi-bullseye", text: "training.examples.itStrategy" },
    { icon: "bi bi-kanban", text: "training.examples.portfolioManagement" },
    { icon: "bi bi-diagram-3", text: "training.examples.pmoVision" },
    { icon: "bi bi-graph-up-arrow", text: "training.examples.okrKpi" },
    { icon: "bi bi-bar-chart-line", text: "training.examples.reports" },
    { icon: "bi bi-gear-wide-connected", text: "training.examples.methodology" },
    { icon: "bi bi-journal-check", text: "training.examples.governance" },
    { icon: "bi bi-cash-coin", text: "training.examples.finance" },
    { icon: "bi bi-people", text: "training.examples.capacity" },
    { icon: "bi bi-patch-check", text: "training.examples.quality" },
    { icon: "bi bi-truck", text: "training.examples.vendor" },
    { icon: "bi bi-mortarboard", text: "training.examples.feasibility" }
  ];
}
