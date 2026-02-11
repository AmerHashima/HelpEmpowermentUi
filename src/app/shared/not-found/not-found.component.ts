import { Component, inject } from '@angular/core';
import {  RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { Shared } from '../Services/shared/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-not-found',
  imports: [RouterLink,TranslateModule,TranslatePipe],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  private shared=inject(Shared);
  lang=this.shared.lang;
  constructor(
    private location: Location,

  ) { }

  goBack() {
    this.location.back();
  }
}
