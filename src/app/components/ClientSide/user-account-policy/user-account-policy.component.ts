import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-account-policy',
  imports: [TranslatePipe,NgFor],
  templateUrl: './user-account-policy.component.html',
  styleUrl: './user-account-policy.component.scss'
})
export class UserAccountPolicyComponent {
  constructor(public translate: TranslateService) { }

  get notAllowedList(): string[] {
    return this.translate.instant('userPolicy.notAllowed') || [];
  }
}
