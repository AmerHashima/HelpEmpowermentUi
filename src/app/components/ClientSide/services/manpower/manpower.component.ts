import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GenericTabsComponent } from '../../../../shared/generic-tabs/generic-tabs.component';
import { Shared } from '../../../../shared/Services/shared/shared';

@Component({
  selector: 'app-manpower',
  imports: [RouterOutlet,GenericTabsComponent],
  templateUrl: './manpower.component.html',
  styleUrl: './manpower.component.scss'
})
export class ManpowerComponent {
  private shared=inject(Shared);
  lang=this.shared.lang;
  tabs = [
    {
      header: 'manpower.postVacancy',
      icon: 'bi bi-file-earmark-plus',
      route: `/${this.lang()}/services/manpower/post-vacancy`
    },
    {
      header: 'manpower.jobSeeker',
      icon: 'bi bi-person-vcard',
      route: `/${this.lang()}/services/manpower/job-seeker`
    }
  ];
}
