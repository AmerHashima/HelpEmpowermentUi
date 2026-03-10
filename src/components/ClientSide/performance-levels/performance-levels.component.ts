// src\components\ClientSide\performance-levels\performance-levels.component.ts
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PerformanceIndicatorsTableComponent } from '../performance-indicators-table/performance-indicators-table.component';

@Component({
  selector: 'app-performance-levels',
  imports: [TranslateModule, PerformanceIndicatorsTableComponent],
  templateUrl: './performance-levels.component.html',
  styleUrl: './performance-levels.component.scss'
})
export class PerformanceLevelsComponent {

}
