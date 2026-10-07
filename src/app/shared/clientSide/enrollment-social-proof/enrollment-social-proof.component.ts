import { Component, input } from '@angular/core';
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
  readonly learners = [
    { image: 'assets/images/profile/person1.jpg', alt: 'Learner 1' },
    { image: 'assets/images/reviewers/person.png', alt: 'Learner 2' },
    { image: 'assets/images/navBar/user.jpg', alt: 'Learner 3' },
    { image: 'assets/images/profile/person.png', alt: 'Learner 4' }
  ];

  useFallback(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/profile/person.png';
  }
}
