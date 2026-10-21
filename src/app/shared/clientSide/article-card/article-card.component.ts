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
  showIcons = input<boolean>(false);

  // Keep the public event names identical to the dashboard bindings. Using
  // direct outputs avoids alias/method-name collisions that left these actions
  // silent in previous builds.
  onEdit = output<void>();
  onDelete = output<void>();

  handleEdit(event: Event) {
    event.stopPropagation();
    this.onEdit.emit();
  }

  handleDelete(event: Event) {
    event.stopPropagation();
    this.onDelete.emit();
  }
  onClick = output<void>();

}






