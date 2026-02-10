import { Component, Input } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [TranslatePipe, TranslateModule],
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class FeatureComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) icon!: string;
}
