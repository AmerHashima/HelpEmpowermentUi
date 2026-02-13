import { Component, inject } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import {  RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-camp',
  imports: [RouterOutlet],
  templateUrl: './camp.component.html',
  styleUrl: './camp.component.scss'
})
export class CampComponent {
  private shared = inject(Shared);
  constructor() {
    this.shared.currentCertificate.set('camp');
  }
  ngOnDestroy(): void {
    this.shared.currentCertificate.set('');
  }
}
