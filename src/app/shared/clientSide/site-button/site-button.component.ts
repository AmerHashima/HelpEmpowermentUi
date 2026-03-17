// src\app\shared\clientSide\site-button\site-button.component.ts
import { NgClass } from '@angular/common';
import { Component, inject, Input, input, output } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../Services/shared/shared';

@Component({
  selector: 'app-site-button',
  standalone: true,
  imports: [TranslatePipe, TranslateModule, NgClass],
  templateUrl: './site-button.component.html',
  styleUrls: ['./site-button.component.scss'],
})
export class SiteButtonComponent {
  private shared=inject(Shared);
  title = input.required<string>();
  icon = input<string>('');
  iconPosition = input<'start' | 'end' | 'auto'>('auto');

  getComputedIcon(): string {
    const icon = this.icon();

    if (!icon) return '';

    // لو الأيقونة arrow → نبدّلها حسب الاتجاه
    if (icon.includes('arrow')) {
      return this.isRTL() ? 'bi bi-arrow-left' : 'bi bi-arrow-right';
    }

    return icon;
  }

  type = input<'main' | 'secondary'>('main');

  htmlType = input<'button' | 'submit' | 'reset'>('button');
  customClass = input<boolean>(false);
  isMarked = input<boolean>(false);
  disabled = input<boolean>(false);
  onClick = output<void>();

  // isRTL = input<boolean>(false);
  isRTL = this.shared.isRtl;

  getIconPosition(): 'start' | 'end' {
    const pos = this.iconPosition();

    if (pos !== 'auto') return pos;

    const icon = this.icon();

    // لو arrow → اربطه بالـ RTL
    if (icon?.includes('arrow')) {
      return 'end'
    }

    // default لباقي الأيقونات
    return 'start';
  }
}
