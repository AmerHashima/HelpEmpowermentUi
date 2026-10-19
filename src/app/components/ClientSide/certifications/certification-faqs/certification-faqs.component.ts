import { Component, inject } from '@angular/core';
import { HomeFAQComponent } from '../../home/home-faq/home-faq.component';
import { Shared } from '../../../../shared/Services/shared/shared';
import { CourseTabContentService } from '../../../../Services/course-tab-content.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-certification-faqs',
  imports: [HomeFAQComponent],
  templateUrl: './certification-faqs.component.html',
  styleUrl: './certification-faqs.component.scss'
})
export class CertificationFaqsComponent {
  protected readonly shared = inject(Shared);
  private readonly tabService = inject(CourseTabContentService);

  readonly tabContent = toSignal(
    toObservable(this.shared.currentCertificate).pipe(
      switchMap(code => code
        ? this.tabService.getTab(code, 'faq', true).pipe(catchError(() => of(null)))
        : of(null))
    ),
    { initialValue: null }
  );

}
