import { Component, input } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';

@Component({
  selector: 'app-courese-features',
  imports: [TranslateModule,TranslatePipe,AccordionComponent],
  templateUrl: './courese-features.component.html',
  styleUrl: './courese-features.component.scss'
})
export class CoureseFeaturesComponent {
  // Input signals
  courseFeature = input.required<{ title: string; description: string }[]>();

}
