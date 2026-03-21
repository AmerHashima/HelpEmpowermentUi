import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NetworkStatusComponent } from '../../components/ClentSide/shared/network-status/network-status.component';
import ApiStatusService from '../Services/ApiService/api-status.service';

@Component({
  selector: 'app-client-main-layout',
  imports: [RouterOutlet, NetworkStatusComponent],
  templateUrl: './client-main-layout.component.html',
  styleUrl: './client-main-layout.component.scss'
})
export class ClientMainLayoutComponent {
  apiStatus = inject(ApiStatusService);

}
