// src\app\shared\certification-card\certification-card.component.ts
import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-certification-card',
  imports: [ButtonComponent, StarRatingComponent, TagComponent],
  templateUrl: './certification-card.component.html',
  styleUrl: './certification-card.component.scss'
})
export class CertificationCardComponent {
  imgSrc = input.required<string>();
  imgAlt = input.required<string>();
  courseDuration = input.required<string>();
  tags = input<string[]>([]);
  courseName = input.required<string>();
  courseAbb = input.required<string>();
  rateValue = input<number>(0);
  hasBtn = input<boolean>(false);
  enrollClick = output<void>();

  enroll() {
    this.enrollClick.emit();
  }
}
