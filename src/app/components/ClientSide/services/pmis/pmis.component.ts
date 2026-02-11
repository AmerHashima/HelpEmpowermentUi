import { Component } from '@angular/core';
import { EnrollFormComponent } from '../enroll-form/enroll-form.component';
import { ServiceTitleComponent } from '../service-title/service-title.component';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { ServicePointComponent } from '../service-point/service-point.component';
import { ServicesPageComponent } from '../services-page/services-page.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
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
  servicePmisCardsInfo = [
    {
      icon: "bi bi-nut",
      header: "Custom Design & Implementation",
      text: "We design and implement custom PMIS solutions tailored to your organization's needs",
    },
    {
      icon: "bi bi-bar-chart-fill",
      header: "Real-Time Dashboards",
      text: "We integrate best-in-class tools like Microsoft Project, Jira, and Asana into a unified system",
    },
    {
      icon: "bi bi-gear-fill",
      header: "Tool Integration",
      text: "We develop real-time dashboards and performance indicators to monitor project health",
    },
    {
      icon: "bi bi-ethernet",
      header: "Cross-Department Connectivity",
      text: "We connect data across departments for complete visibility and better decision-making",
    },
    {
      icon: "bi bi-mortarboard-fill",
      header: "Team Training",
      text: "We train your teams to maximize the system's potential",
    },
  ];

  keyBenfits = [
    {
      icon: "bi bi-bar-chart-fill",
      text: '47% increase in project tracking efficiency (PMI Institute - seminal "Pulse of the Profession" )',
    },
    {
      icon: "bi bi-flag-fill",
      text: ' 52% improvement in project reporting accuracy (Gartner Study - "Project and Portfolio Management Magic Quadrant")',
    },
    {
      icon: "bi bi-calendar-range-fill",
      text: '35% time savings in data collection and reporting (PwC Research - "Project Management Benchmark")',
    },
  ];

}
