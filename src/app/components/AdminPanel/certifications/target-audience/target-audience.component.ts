import { Component, input } from '@angular/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-target-audience',
  imports: [AccordionComponent,TranslatePipe],
  templateUrl: './target-audience.component.html',
  styleUrl: './target-audience.component.scss'
})
export class TargetAudienceComponent {
  targetAudiences = input.required<string[]>();

  readonly accordionTitle = 'Target Audience';
}
