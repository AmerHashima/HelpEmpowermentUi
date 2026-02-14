import { Component, inject } from '@angular/core';
import { Shared } from '../../../../shared/Services/shared/shared';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-pmp',
  imports: [RouterOutlet],
  templateUrl: './pmp.component.html',
  styleUrl: './pmp.component.scss'
})
export class PmpComponent {
 private shared=inject(Shared);
 constructor(){
  this.shared.currentCertificate.set('pmp');
 }
  ngOnDestroy(): void {
    this.shared.currentCertificate.set('');
  }
}
