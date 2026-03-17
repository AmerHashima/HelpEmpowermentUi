// src\app\shared\clientSide\certification-cards\certification-cards.component.ts
import { Component, input, computed, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteButtonComponent } from '../site-button/site-button.component';
import { TagComponent } from '../../tag/tag.component';
import { StarRatingComponent } from '../../star-rating/star-rating.component';
import { Shared } from '../../Services/shared/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';

// Assuming you have a type/interface for the data
export interface CertificationItem {
  imgAlt: string;
  courseDuration: string;
  tags: string[];
  courseName: string;
  courseAbb: string;
  rateValue: number;
  courseCode:string
}


export const certifications: CertificationItem[] = [
  {
    imgAlt: 'home.certifications.pmp.alt',
    courseDuration: 'home.certifications.pmp.duration',
    tags: [
      'home.certifications.tags.advanced',
      'home.certifications.tags.global'
    ],
    courseAbb: 'home.certifications.pmp.subtitle',
    courseName: 'home.certifications.pmp.title',
    courseCode: 'PMP',
    rateValue: 4.8,
  },
  {
    imgAlt: 'home.certifications.capm.alt',
    courseDuration: 'home.certifications.capm.duration',
    tags: [
      'home.certifications.tags.foundational',
      'home.certifications.tags.starter'
    ],
    courseAbb: 'home.certifications.capm.subtitle',
    courseName: 'home.certifications.capm.title',
    courseCode: 'CAPM',
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
  private router = inject(Router);

  isRTL = this.shared.isRtl;
  enrollCourse = output<CertificationItem>();
  private images = [
    'assets/images/certifications/certfication_1.jpeg',
    'assets/images/certifications/certfication_2.jpeg'
  ];

  getImage(index: number): string {
    return this.images[index % 2];
  }

  onEnroll(item: CertificationItem) {
    this.router.navigateByUrl(`/${this.shared.lang()}/certifications/${item.courseCode.toLowerCase()}`);
    // this.enrollCourse.emit(item)
  }
}
