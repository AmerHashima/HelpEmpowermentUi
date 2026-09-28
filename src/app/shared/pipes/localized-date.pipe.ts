import { formatDate } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { Shared } from '../Services/shared/shared';

@Pipe({
  name: 'localizedDate',
  standalone: true,
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {
  private shared = inject(Shared);

  transform(
    value: string | number | Date | null | undefined,
    format = 'mediumDate'
  ): string {
    if (value === null || value === undefined || value === '') return '';

    const locale = this.shared.lang() === 'ar' ? 'ar-EG' : 'en-GB';

    try {
      return formatDate(value, format, locale);
    } catch {
      return '';
    }
  }
}
