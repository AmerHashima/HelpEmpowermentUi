import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { ServiceCardComponent } from '../../../ClientSide/services/service-card/service-card.component';
import { Shared } from '../../../../shared/Services/shared/shared';
interface InstructorData {
  introParagragh: string;
  skills: any[];
  certifcations: string[];
}
@Component({
  selector: 'app-instructor-info',
  imports: [
    CommonModule,
    TranslateModule,
    AccordionComponent,
    ServiceCardComponent
  ],
  templateUrl: './instructor-info.component.html',
  styleUrl: './instructor-info.component.scss'
})
export class InstructorInfoComponent {
  private shared = inject(Shared);
  certification = this.shared.currentCertificate;

  instructor = signal<any>({
    introParagragh: "Expert in translating the organizational strategy into tangible results with 20 years of hands-on experience, I build the frameworks for lasting success. My expertise covers the full spectrum of strategic delivery:",
    skills: [
      {
        icon: "bi bi-person-badge",
        header: "Strategic Project & Program Leadership",
        text: "Directly leading complex initiatives to deliver high-value outcomes on scope, time, and budget."
      },
      {
        icon: "bi bi-briefcase",
        header: "Portfolio Optimization",
        text: "Aligning project investments with core business strategy to maximize return and manage risk."
      },
      {
        icon: "bi bi-building",
        header: "PMO Design & Implementation",
        text: "Establishing and leading Project Management Offices as strategic centers of excellence."
      },
      {
        icon: "bi bi-bar-chart",
        header: "Project Management Maturity",
        text: "Assessing and elevating organizational capabilities to improve efficiency and reduce risk."
      }
    ],
    certifcations: [
      "B.Sc. of Electrical Engineering (Computer & Automatic Control)",
      "Authorized Training Partner (PMI - ATP) Instructor",
      "PMI - Program Management Professional (PgMP)",
      "PMI - Project Management Professional (PMP)",
      "PMI – Project Management Office – Certified Practitioner (PMO-CP)",
      "PMI - Agile Certified Practitioner (PMI-ACP)",
      "PMI - Professional in Business Analysis (PMI-PBA)",
      "AXELOS – P3O certificate in Portfolio, Program and Project Offices",
      "AXELOS – ITIL Foundation Certificate in IT Services Management",
      "CompTIA Project+ PK0-003",
      "Managing Projects with Microsoft Project 2013",
      "Cisco Certified Network Associate (CCNA)",
      "Cisco Certified Network Professional (CCNP)",
      "PMI - Train The Trainer",
      "Microsoft Certified Technology Specialist (MCTS)"
    ]
  })
  readonly accordionTitle = 'Instructor Info'
}
