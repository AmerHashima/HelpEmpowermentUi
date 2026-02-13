import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { Shared } from '../../../../shared/Services/shared/shared';


interface ResourceItem {
  type: 'pdf' | 'image' | 'presentation' | string;
  name: string;
  src: string;
}

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AccordionComponent
  ],
  templateUrl: './course-resources.component.html',
  styleUrls: ['./course-resources.component.scss']
})
export class ResourcesComponent {
  private shared = inject(Shared);
  certification = this.shared.currentCertificate;
  
  resources = computed(() => {
    if (this.certification() == 'pmp')
      return [
        {
          type: "pdf",
          name: "PMP Study Guide",
          src: "/resources/pmp-study-guide.pdf",
        },
        {
          type: "presentation",
          name: "PMP Framework Overview",
          src: "/resources/pmp-framework.pptx",
        },
        {
          type: "image",
          name: "49 Processes Chart",
          src: "/resources/49-processes.png",
        },
        {
          type: "pdf",
          name: "Agile Practice Guide",
          src: "/resources/agile-practice-guide.pdf",
        },
        {
          type: "presentation",
          name: "Risk Management Slides",
          src: "/resources/risk-management.pptx",
        },
        {
          type: "image",
          name: "Process Groups Flow",
          src: "/resources/process-groups-flow.jpg",
        },
      ];
    else
      return [];
  })
  readonly accordionTitle = 'Course Resources';
}
