import { NgIf } from '@angular/common';
import { Component, input, TemplateRef } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

let accordionIdCounter = 0;

@Component({
  selector: 'app-accordion',
  imports: [TranslateModule,TranslatePipe,NgIf],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss'
})
export class AccordionComponent {
  title = input.required<string>();
  content = input<string | TemplateRef<any>>();

  accordionId = `accordion-${accordionIdCounter++}`;
  collapseId = `collapse-${accordionIdCounter++}`;
}
