import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';


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
  resources = input.required<ResourceItem[]>();

  readonly accordionTitle = 'Course Resources';
}
