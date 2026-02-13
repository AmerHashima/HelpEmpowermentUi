import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { ServiceCardComponent } from '../../../ClientSide/services/service-card/service-card.component';
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
  instructor = input.required<InstructorData>();

  readonly accordionTitle = 'Instructor Info'
}
