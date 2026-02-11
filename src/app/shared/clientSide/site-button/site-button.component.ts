import { NgClass } from '@angular/common';
import {  Component, input, output } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-site-button',
  standalone: true,
  imports: [TranslatePipe,TranslateModule,NgClass],
  templateUrl: './site-button.component.html',
  styleUrls: ['./site-button.component.scss'],
})
export class SiteButtonComponent {
  title = input.required<string>();
  icon = input<string>('');
  type = input<'main' | 'secondary'>('main');
  htmlType = input<'button' | 'submit' | 'reset'>('button');

  onClick = output<void>();

  isRTL = input<boolean>(false);

}
