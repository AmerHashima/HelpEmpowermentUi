import { Component, inject, input, TemplateRef } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-services-page',
  imports: [TranslateModule,TranslatePipe,NgTemplateOutlet],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.scss'
})
export class ServicesPageComponent {
  private shared=inject(Shared);
  isRTL=this.shared.isRtl;
  mainTitle = input<string>('');
  mainParagraph = input.required<string>();
  secondParagraph = input<string>('');

  titledSection = input<TemplateRef<any> | null>(null);
  pointSection = input<TemplateRef<any> | null>(null);
  titledSection2 = input<TemplateRef<any> | null>(null);
  titledSection3 = input<TemplateRef<any> | null>(null);
  sectionTag = input<TemplateRef<any> | null>(null);
}
