import { Component, input } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-card',
  imports: [TranslateModule,TranslatePipe],
  templateUrl: './contact-card.component.html',
  styleUrl: './contact-card.component.scss'
})
export class ContactCardComponent {
  icon = input.required<string>();
  header = input.required<string>();
  value = input.required<string>();
}
