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
    if (this.certification() == 'pmp')
      return [
        "Experienced project managers ",
        "PMO members",
        "Consultant",
        "Department Heads",
        "Team leads",
      ];
    else
      return [];
  })
  readonly accordionTitle = 'Target Audience';
}
