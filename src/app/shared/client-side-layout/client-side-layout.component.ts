import { Component } from '@angular/core';
import { ClientNavbarComponent } from '../clientSide/navbar/navbar.component';
import { Main } from '../../components/main/main';

@Component({
  selector: 'app-client-side-layout',
  imports: [ClientNavbarComponent, Main],
  templateUrl: './client-side-layout.component.html',
  styleUrl: './client-side-layout.component.scss'
})
export class ClientSideLayoutComponent {

}
