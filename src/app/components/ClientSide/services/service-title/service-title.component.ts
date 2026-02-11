import { Component, inject, input, TemplateRef } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-service-title',
  imports: [TranslateModule,TranslatePipe,NgTemplateOutlet],
  templateUrl: './service-title.component.html',
  styleUrl: './service-title.component.scss'
})
export class ServiceTitleComponent {
  mainTitle = input.required<string>();
  text = input<string>('');
  content = input<TemplateRef<any> | null>(null);
}
