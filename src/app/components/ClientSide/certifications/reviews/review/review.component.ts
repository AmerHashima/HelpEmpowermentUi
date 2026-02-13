import { NgClass } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { StarRatingComponent } from '../../../../../shared/star-rating/star-rating.component';

@Component({
  selector: 'app-review',
  imports: [TranslatePipe,StarRatingComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
  sectionImage = input<string>('');
  reviewerName = input<string>('');
  reviewDate = input<string>('');
  reviewTopic = input<string>('');
  reviewRate = input<number>(0);
  reviewDescription = input<string>('');
  readonly MAX_LENGTH = 100;

  // Internal state for read more / less
  expanded = signal(false);

  // Computed values
  isLongText = computed(() => this.reviewDescription().length > this.MAX_LENGTH);

  displayedText = computed(() => {
    const text = this.reviewDescription();
    return this.expanded() || !this.isLongText()
      ? text
      : text.slice(0, this.MAX_LENGTH) + '...';
  });


  toggleExpanded() {
    this.expanded.update(v => !v);
  }
}
