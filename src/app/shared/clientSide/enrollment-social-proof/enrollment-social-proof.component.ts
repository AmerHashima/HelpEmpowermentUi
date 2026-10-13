import { Component, computed, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CourseTabContentService } from '../../../Services/course-tab-content.service';

@Component({
  selector: 'app-enrollment-social-proof',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './enrollment-social-proof.component.html',
  styleUrl: './enrollment-social-proof.component.scss'
})
export class EnrollmentSocialProofComponent {
  count = input('500+');
  images = input<string[]>([]);
  variant = input(0);
  private readonly contentService = inject(CourseTabContentService);
  private readonly learnerImages = [
    { image: 'assets/images/navBar/user.jpg', alt: 'Learner 1' },
    { image: 'assets/images/profile/person.png', alt: 'Learner 2' },
    { image: 'assets/images/profile/person1.jpg', alt: 'Learner 3' },
    { image: 'assets/images/reviewers/person.png', alt: 'Learner 4' }
  ];
  readonly learners = computed(() => {
    const offset = Math.abs(this.variant()) % this.learnerImages.length;
    const fallbackImages = [
      ...this.learnerImages.slice(offset),
      ...this.learnerImages.slice(0, offset)
    ];
    const configuredImages = this.images().slice(0, 4);
    return Array.from({ length: 4 }, (_, index) => {
      const image = configuredImages[index]?.trim();
      return image
        ? {
            image: this.resolveImage(image),
            legacyImage: this.isStoredFileName(image)
              ? this.contentService.getInstructorImageUrl(image)
              : '',
            alt: `Learner ${index + 1}`
          }
        : { ...fallbackImages[index], legacyImage: '' };
    });
  });

  useFallback(event: Event, legacyImage: string): void {
    const element = event.target as HTMLImageElement;
    if (legacyImage && element.src !== legacyImage) {
      element.src = legacyImage;
      return;
    }
    element.onerror = null;
    element.src = 'assets/images/profile/person.png';
  }

  private resolveImage(image: string): string {
    return this.isStoredFileName(image)
      ? this.contentService.getSocialProofImageUrl(image)
      : image;
  }

  private isStoredFileName(image: string): boolean {
    return !image.includes('/') && !image.includes('\\');
  }
}
