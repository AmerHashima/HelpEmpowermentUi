import { Component, computed, inject, input } from '@angular/core';
import { AccordionComponent } from '../../../../shared/accordion/accordion.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../../shared/Services/shared/shared';

@Component({
  selector: 'app-target-audience',
  imports: [AccordionComponent,TranslatePipe],
  templateUrl: './target-audience.component.html',
  styleUrl: './target-audience.component.scss'
})
export class TargetAudienceComponent {
  private shared = inject(Shared);
  certification = this.shared.currentCertificate;


  targetAudiences = computed(() => {
    if (this.certification() === 'pmp')
      return [
        'targetAudiences.pmp.0',
        'targetAudiences.pmp.1',
        'targetAudiences.pmp.2',
        'targetAudiences.pmp.3',
        'targetAudiences.pmp.4',
      ];
    else
      return     [
        'targetAudiences.capm.0',
        'targetAudiences.capm.1',
        'targetAudiences.capm.2',
        'targetAudiences.capm.3',
        'targetAudiences.capm.4',
      ];;
  });
  readonly accordionTitle = 'Target Audience';
}
