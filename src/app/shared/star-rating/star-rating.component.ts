// src\app\shared\star-rating\star-rating.component.ts
import { Component, computed, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  imports: [],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss'
})
export class StarRatingComponent {
  value = input<number>(0);
  max = input<number>(5);
  readOnly = input<boolean>(false);

  ratingChange = output<number>();

  hovered = signal(0);

  currentRating = computed(() =>
    this.hovered() || this.value()
  );

  onClick(rating: number): void {
    if (!this.readOnly()) {
      this.ratingChange.emit(rating);
    }
  }

  onMouseEnter(rating: number): void {
    if (!this.readOnly()) {
      this.hovered.set(rating);
    }
  }

  onMouseLeave(): void {
    if (!this.readOnly()) {
      this.hovered.set(0);
    }
  }

  stars(): number[] {
    return Array.from({ length: this.max() }, (_, i) => i + 1);
  }
}
