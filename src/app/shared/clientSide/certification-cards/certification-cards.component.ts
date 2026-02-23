// src\app\shared\clientSide\certification-cards\certification-cards.component.ts
import { Component, input, computed, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteButtonComponent } from '../site-button/site-button.component';
import { TagComponent } from '../../tag/tag.component';
import { StarRatingComponent } from '../../star-rating/star-rating.component';
import { Shared } from '../../Services/shared/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

// Assuming you have a type/interface for the data
export interface CertificationItem {
  imgAlt: string;
  courseDuration: string;
  tags: string[];
  courseName: string;
  courseAbb: string;
  rateValue: number;
}


export const certifications: CertificationItem[] = [
  {
    imgAlt: 'Certification 1 alt',
    courseDuration: '35 Hours',
    tags: ['Advanced', 'Global Standard'],
    courseAbb: 'Project Management Professional',
    courseName: 'PMP® Certification',
    rateValue: 4.8,
  },
  {
    imgAlt: 'Certification 2 alt',
    courseDuration: '23 Hours',
    tags: ['Foundational', 'Career Starter'],
    courseAbb: 'Certified Associate in Project Management',
    courseName: 'CAPM® Certification',
    rateValue: 4.8,
  },
];

@Component({
  selector: 'app-certification-cards',
  standalone: true,
  imports: [
    TagComponent,
    SiteButtonComponent,
    StarRatingComponent,
    TranslateModule,
    TranslatePipe,
    CommonModule
  ],
  templateUrl: './certification-cards.component.html',
  styleUrl: './certification-cards.component.scss'
})
export class CertificationCardsComponent {

  certifications = input<CertificationItem[]>(certifications);
  private shared = inject(Shared);
  isRTL = this.shared.isRtl;
  enrollCourse = output<CertificationItem>();
  private images = [
    'assets/images/certifications/certfication_1.jpeg',
    'assets/images/certifications/certfication_2.jpeg'
  ];

  getImage(index: number): string {
    return this.images[index % 2];
  }

  // Replace with real navigation / enrollment logic
  onEnroll(item: CertificationItem) {
    this.enrollCourse.emit(item)
  }
}
