import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, TranslatePipe],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss'
})
export class TermsAndConditionsComponent {
  sections!: Observable<any[]>;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.sections = this.translate.stream('terms.sections');
  }
}
