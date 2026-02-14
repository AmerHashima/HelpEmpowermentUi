import { Component, computed, inject, input } from '@angular/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';

@Component({
  selector: 'app-courese-outline',
  imports: [AccordionComponent,TranslateModule,TranslatePipe],
  templateUrl: './courese-outline.component.html',
  styleUrl: './courese-outline.component.scss'
})
export class CoureseOutlineComponent {
  private shared=inject(Shared);
  certification=this.shared.currentCertificate;
  courseOutlines = computed(() => {
    if (this.certification() == 'pmp')
      return [
        "Leadership Level",
        "Project Management Fundamentals & Framework",
        "Project Life Cycles & Development Approaches",
        "Project Integration Management",
        "Scope, Schedule, and Cost Management",
        "Quality, Resource, and Communications Management",
        "Risk, Procurement, and Stakeholder Management",
        "Professional Responsibility & Ethics",
        "Real-world scenario simulations, tool-based planning exercises, and agile methodology implementation",
        "Applying the main domains “People, Process & Business Environment” in the 49 processes.",
      ];
    else
      return [
        "Foundation & Awareness Level",
        "Project Management Fundamentals & Framework",
        "Project Life Cycles & Development Approaches",
        "Project Integration Management",
        "Scope, Schedule, and Cost Management",
        "Quality, Resource, and Communications Management",
        "Risk, Procurement, and Stakeholder Management",
        "Professional Responsibility & Ethics",
        "Real-world scenario simulations, tool-based planning exercises, and agile methodology"
      ];
  })
}
