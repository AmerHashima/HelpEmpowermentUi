import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-refund-policy',
  imports: [TranslatePipe,NgFor,NgIf],
  templateUrl: './refund-policy.component.html',
  styleUrl: './refund-policy.component.scss'
})
export class RefundPolicyComponent {
  sections: any[] = [];
  introList: string[] = [];

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.translate.get('refund.sections').subscribe(res => {
      this.sections = res;
    });

    this.translate.get('refund.intro').subscribe(res => {
      this.introList = res;
    });
  }
}
