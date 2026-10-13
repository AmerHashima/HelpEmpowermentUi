import { Component, computed, inject } from '@angular/core';
import { HomeFAQComponent } from '../../home/home-faq/home-faq.component';
import { PageBannerComponent } from '../../../../shared/clientSide/page-banner/page-banner.component';
import { Shared } from '../../../../shared/Services/shared/shared';
import { CourseTabContentService } from '../../../../Services/course-tab-content.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-certification-faqs',
  imports: [HomeFAQComponent, PageBannerComponent],
  templateUrl: './certification-faqs.component.html',
  styleUrl: './certification-faqs.component.scss'
})
export class CertificationFaqsComponent {
  protected readonly shared = inject(Shared);
  private readonly tabService = inject(CourseTabContentService);

  readonly tabContent = toSignal(
    toObservable(this.shared.currentCertificate).pipe(
      switchMap(code => code
        ? this.tabService.getTab(code, 'faq').pipe(catchError(() => of(null)))
        : of(null))
    ),
    { initialValue: null }
  );

  readonly banner = computed(() =>
    this.tabContent()?.content.banner[this.shared.isRtl() ? 'ar' : 'en']
  );

  readonly bannerMediaUrl = computed(() =>
    this.tabContent()?.content.banner.mediaUrl?.trim() ?? ''
  );

}
