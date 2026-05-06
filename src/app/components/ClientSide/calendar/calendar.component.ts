// src\app\components\ClientSide\calendar\calendar.component.ts
import { Component, inject } from '@angular/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { PageBannerComponent } from '../../../shared/clientSide/page-banner/page-banner.component';
import { CalendarCardComponent } from './calendar-card/calendar-card.component';

@Component({
  selector: 'app-calendar',
  imports: [TranslateModule,TranslatePipe,PageBannerComponent,
    CalendarCardComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;
  calendarData = [
    {
      title: "PMP Live Course",
      icon: "bi bi-camera-video",
      startDate: "20-Feb-26",
      endDate: "20-Mar-26",
      route: "",
    },
    {
      title: "PMP Webinar",
      icon: "bi bi-camera-video",
      startDate: "20-Feb-26",
      endDate: "20-Mar-26",
      route: "",
    },
    {
      title: "capm Course",
      icon: "bi bi-camera-video",
      startDate: "20-Feb-26",
      endDate: "20-Mar-26",
      route: "",
    },
    {
      title: "capm Webinar",
      icon: "bi bi-camera-video",
      startDate: "20-Feb-26",
      endDate: "20-Mar-26",
      route: "",
    },
  ];

  onCardClick(item:any){
  }
}
