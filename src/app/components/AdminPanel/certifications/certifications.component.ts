import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { CertificationsStore } from '../../../AdminPanelStores/CertificationStore/certification.store';


@Component({
  selector: 'app-certifications',
  imports: [RouterOutlet],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
  providers: [CertificationsStore]
})
export class CertificationsComponent {
}
