import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-service-card',
  imports: [TranslateModule,TranslatePipe,NgClass],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {
  icon = input<string>('');
  header = input<string>('');
  text = input<string>('');
  source = input<string>('');
  newClass = input<string>('');
}
