// src\components\ClientSide\performance-indicators-table\performance-indicators-table.component.ts
import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CertificationDisplaySettings } from '../../../app/models/course-tab-content';
import { Shared } from '../../../app/shared/Services/shared/shared';

@Component({
  selector: 'app-performance-indicators-table',
  imports: [TranslatePipe],
  templateUrl: './performance-indicators-table.component.html',
  styleUrl: './performance-indicators-table.component.scss'
})
export class PerformanceIndicatorsTableComponent {
  levels = input<CertificationDisplaySettings['examResult']['levels']>([]);
  private shared = inject(Shared);
  levelName(index: number, fallback: string): string {
    const level = this.levels()[index];
    return level ? (this.shared.lang() === 'ar' ? level.nameAr : level.nameEn) : fallback;
  }
}
