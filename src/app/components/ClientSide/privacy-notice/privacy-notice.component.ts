import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-privacy-notice',
  imports: [NgFor,NgIf,AsyncPipe],
  templateUrl: './privacy-notice.component.html',
  styleUrl: './privacy-notice.component.scss'
})
export class PrivacyNoticeComponent {
  sections!: Observable<any[]>;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.sections = this.translate.get('privacy.sections');
  }
}
