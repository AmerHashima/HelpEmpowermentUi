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
    introParagragh: 'instructor.introParagragh',

    skills: [
      {
        icon: "bi bi-person-badge",
        header: "instructor.skills.0.header",
        text: "instructor.skills.0.text"
      },
      {
        icon: "bi bi-briefcase",
        header: "instructor.skills.1.header",
        text: "instructor.skills.1.text"
      },
      {
        icon: "bi bi-building",
        header: "instructor.skills.2.header",
        text: "instructor.skills.2.text"
      },
      {
        icon: "bi bi-bar-chart",
        header: "instructor.skills.3.header",
        text: "instructor.skills.3.text"
      }
    ],

    certifcations: [
      "instructor.certifications.0",
      "instructor.certifications.1",
      "instructor.certifications.2",
      "instructor.certifications.3",
      "instructor.certifications.4",
      "instructor.certifications.5",
      "instructor.certifications.6",
      "instructor.certifications.7",
      "instructor.certifications.8",
      "instructor.certifications.9",
      "instructor.certifications.10",
      "instructor.certifications.11",
      "instructor.certifications.12",
      "instructor.certifications.13",
      "instructor.certifications.14"
    ]
  });
  readonly accordionTitle = 'instructor.info'
}
