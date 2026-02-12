import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-banner',
  imports: [],
  templateUrl: './page-banner.component.html',
  styleUrl: './page-banner.component.scss'
})
export class PageBannerComponent {
  isRTL = input<boolean>(false);
  media = input<any>();
  content = input<any>();
  isGrow = input<boolean>(true);
}
