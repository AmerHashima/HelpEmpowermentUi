import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cancellation-policy',
  imports: [AsyncPipe, NgFor, NgIf, TranslatePipe],
  templateUrl: './cancellation-policy.component.html',
  styleUrl: './cancellation-policy.component.scss'
})
export class CancellationPolicyComponent {
  sections!: Observable<any[]>;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.sections = this.translate.stream('cancellationPolicy.sections');
  }
}
