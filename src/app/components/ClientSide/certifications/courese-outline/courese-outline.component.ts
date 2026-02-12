import { Component, input } from '@angular/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-courese-outline',
  imports: [AccordionComponent,TranslateModule,TranslatePipe],
  templateUrl: './courese-outline.component.html',
  styleUrl: './courese-outline.component.scss'
})
export class CoureseOutlineComponent {
  courseOutline = input<string[]>([]);
}
