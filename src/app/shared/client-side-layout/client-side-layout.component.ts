import { Component } from '@angular/core';
import { ClientNavbarComponent } from '../clientSide/navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ClientMainLayoutComponent } from '../client-main-layout/client-main-layout.component';

@Component({
  selector: 'app-client-side-layout',
  imports: [ClientNavbarComponent, FooterComponent, ClientMainLayoutComponent],
  templateUrl: './client-side-layout.component.html',
  styleUrl: './client-side-layout.component.scss'
})
export class ClientSideLayoutComponent {

}
