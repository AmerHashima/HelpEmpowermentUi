import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-technical-support-policy',
  imports: [NgFor,NgIf],
  templateUrl: './technical-support-policy.component.html',
  styleUrl: './technical-support-policy.component.scss'
})
export class TechnicalSupportPolicyComponent {

  sections: any[] = [];

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.translate.get('support.sections').subscribe(res => {
      this.sections = res;
    });
  }
}
