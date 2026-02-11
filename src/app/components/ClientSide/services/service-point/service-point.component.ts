import { Component, input } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ServiceCardComponent } from '../service-card/service-card.component';

interface CardPointInfo {
  icon: string;
  header: string;
  text: string;
  [key: string]: any;
}

@Component({
  selector: 'app-service-point',
  imports: [TranslateModule,TranslatePipe,ServiceCardComponent],
  templateUrl: './service-point.component.html',
  styleUrl: './service-point.component.scss'
})
export class ServicePointComponent {
  mainTitle = input.required<string>();
  subTitle = input.required<string>();
  cardPointsInfo = input<CardPointInfo[]>([]);
}
