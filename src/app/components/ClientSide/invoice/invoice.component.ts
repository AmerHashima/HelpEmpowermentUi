import { Component, inject, input } from '@angular/core';
import { Shared } from '../../../shared/Services/shared/shared';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizedDatePipe } from '../../../shared/pipes/localized-date.pipe';

@Component({
  selector: 'app-invoice',
  imports: [LocalizedDatePipe, TranslatePipe],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent {
  private shared=inject(Shared);
  isRTL=this.shared.isRtl;
  invoice = input<any>();
}
