import { Component, inject, input, output } from '@angular/core';
import {  NgClass } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../Services/shared/shared';
@Component({
  selector: 'app-article-card',
  imports: [TranslateModule , TranslatePipe,NgClass],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss'
})
export class ArticleCardComponent {
  // Inputs as signals
  private shared=inject(Shared);
  isRTL=this.shared.isRtl;
  imgSrc = input.required<string>();
  imgAlt = input.required<string>();
  date = input.required<string>();
  publishTime = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();

  onClick = output<void>();
}






