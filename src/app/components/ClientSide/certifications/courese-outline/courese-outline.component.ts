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
    if (this.certification() === 'pmp')
      return [
        'courseOutlines.pmp.0',
        'courseOutlines.pmp.1',
        'courseOutlines.pmp.2',
        'courseOutlines.pmp.3',
        'courseOutlines.pmp.4',
        'courseOutlines.pmp.5',
        'courseOutlines.pmp.6',
        'courseOutlines.pmp.7',
        'courseOutlines.pmp.8',
        'courseOutlines.pmp.9',
      ];
    else
      return [
        'courseOutlines.capm.0',
        'courseOutlines.capm.1',
        'courseOutlines.capm.2',
        'courseOutlines.capm.3',
        'courseOutlines.capm.4',
        'courseOutlines.capm.5',
        'courseOutlines.capm.6',
        'courseOutlines.capm.7',
        'courseOutlines.capm.8',
      ];
  });
}
