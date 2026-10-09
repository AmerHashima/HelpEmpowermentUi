import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-enrollment-social-proof',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './enrollment-social-proof.component.html',
  styleUrl: './enrollment-social-proof.component.scss'
})
export class EnrollmentSocialProofComponent {
  count = input('500+');
  variant = input(0);
  private readonly learnerImages = [
    { image: 'assets/images/navBar/user.jpg', alt: 'Learner 1' },
    { image: 'assets/images/profile/person.png', alt: 'Learner 2' },
    { image: 'assets/images/profile/person1.jpg', alt: 'Learner 3' },
    { image: 'assets/images/reviewers/person.png', alt: 'Learner 4' }
  ];
  readonly learners = computed(() => {
    const offset = Math.abs(this.variant()) % this.learnerImages.length;
    return [
      ...this.learnerImages.slice(offset),
      ...this.learnerImages.slice(0, offset)
    ];
  });

  useFallback(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/profile/person.png';
  }
}
