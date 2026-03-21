import { Component,  inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import ApiStatusService from '../../../../shared/Services/ApiService/api-status.service';
import { Shared } from '../../../../shared/Services/shared/shared';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-network-status',
  standalone: true,
  imports:[TranslatePipe,RouterLink],
  templateUrl: './network-status.component.html',
  styleUrl: './network-status.component.scss'

})
export class NetworkStatusComponent {
  private shared = inject(Shared);
  apiStatus = inject(ApiStatusService);
  private router = inject(Router);
  lang = this.shared.lang;
  constructor(

  ) { }
  retry() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]);
    });  }
}
