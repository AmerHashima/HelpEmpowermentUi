import { Component } from '@angular/core';
import { PerformanceIndicatorsTableComponent } from '../performance-indicators-table/performance-indicators-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-performance-levels',
  imports: [PerformanceIndicatorsTableComponent,TranslatePipe],
  templateUrl: './performance-levels.component.html',
  styleUrl: './performance-levels.component.scss'
})
export class PerformanceLevelsComponent {

}
