import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-refund-policy',
  imports: [TranslatePipe, NgFor, NgIf, AsyncPipe],
  templateUrl: './refund-policy.component.html',
  styleUrl: './refund-policy.component.scss'
})
export class RefundPolicyComponent {
  sections!: Observable<any[]>;
  introList!: Observable<string[]>;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.sections = this.translate.stream('legalRefund.sections');
    this.introList = this.translate.stream('legalRefund.intro');
  }
}
