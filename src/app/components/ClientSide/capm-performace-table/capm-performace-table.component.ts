import { Component, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CertificationDisplaySettings } from '../../../models/course-tab-content';
import { Shared } from '../../../shared/Services/shared/shared';

@Component({
  selector: 'app-capm-performace-table',
  imports: [TranslatePipe],
  templateUrl: './capm-performace-table.component.html',
  styleUrl: './capm-performace-table.component.scss'
})
export class CapmPerformaceTableComponent {
  levels = input<CertificationDisplaySettings['examResult']['levels']>([]);
  private shared = inject(Shared);
  levelName(index: number, fallback: string): string {
    const level = this.levels()[index];
    if (!level) return fallback;
    return this.shared.lang() === 'ar' ? level.nameAr : level.nameEn;
  }
}
