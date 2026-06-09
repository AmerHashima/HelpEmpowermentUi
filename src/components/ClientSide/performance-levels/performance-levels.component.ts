// src\components\ClientSide\performance-levels\performance-levels.component.ts
import { Component, inject } from '@angular/core';
import { PerformanceIndicatorsTableComponent } from '../performance-indicators-table/performance-indicators-table.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Shared } from '../../../app/shared/Services/shared/shared';
import { CapmPerformaceTableComponent } from '../../../app/components/ClientSide/capm-performace-table/capm-performace-table.component';

@Component({
  selector: 'app-performance-levels',
  imports: [PerformanceIndicatorsTableComponent, TranslatePipe,CapmPerformaceTableComponent],
  templateUrl: './performance-levels.component.html',
  styleUrl: './performance-levels.component.scss'
})
export class PerformanceLevelsComponent {
 private shared=inject(Shared);
 cert=this.shared.currentCertificate;
}
