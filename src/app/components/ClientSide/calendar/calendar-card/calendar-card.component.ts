import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-calendar-card',
  imports: [TranslateModule,TranslatePipe],
  templateUrl: './calendar-card.component.html',
  styleUrl: './calendar-card.component.scss'
})
export class CalendarCardComponent {
  private shared=inject(Shared);
  isRTL=this.shared.isRtl
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() startDate: string = '';
  @Input() endDate: string = '';

  @Output() cardClick = new EventEmitter<void>();

  constructor() { }

  get detailsArrowIcon(): string {
    return this.isRTL() ? 'bi bi-arrow-left' : 'bi bi-arrow-right';
  }

  onDetailsClick() {
    this.cardClick.emit();
  }
}
