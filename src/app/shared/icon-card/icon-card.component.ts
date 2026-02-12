import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Shared } from '../Services/shared/shared';
import { NgClass, NgIf } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-icon-card',
  imports: [NgIf,NgClass,TranslateModule,TranslatePipe],
  templateUrl: './icon-card.component.html',
  styleUrl: './icon-card.component.scss'
})
export class IconCardComponent {
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;

  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() gap: string = 'gap-3';

  @Input() onClick: (() => void) | null = null;

}
