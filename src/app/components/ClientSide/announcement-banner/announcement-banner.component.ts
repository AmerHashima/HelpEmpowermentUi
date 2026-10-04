import { isPlatformBrowser } from '@angular/common';
import { Component, inject, Input, PLATFORM_ID, signal } from '@angular/core';
import { Announcement } from '../../../shared/client-side-layout/client-side-layout.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-announcement-banner',
  standalone:true,
  imports: [],
  templateUrl: './announcement-banner.component.html',
  styleUrl: './announcement-banner.component.scss'
})
export class AnnouncementBannerComponent {
  private platformId = inject(PLATFORM_ID);
  private translate = inject(TranslateService);
  @Input() announcements: Announcement[] = [];

  currentIndex = signal(0);

  private intervalId?: ReturnType<typeof setInterval>;

  get visibleAnnouncements(): Announcement[] {

    return this.announcements.filter(x => x.isVisible);

  }

  get currentAnnouncement(): Announcement | null {

    const announcements = this.visibleAnnouncements;

    if (!announcements.length) {

      return null;

    }

    return announcements[this.currentIndex()];

  }

  announcementText(value: string): string {
    if (!value) return '';
    const subjectMatch = value.match(/^subject:\s*(.+)$/i);
    if (subjectMatch) {
      const subject = this.translate.instant('announcement.subject');
      const translatedValue = this.translate.instant(subjectMatch[1].trim());
      return `${subject}: ${translatedValue}`;
    }
    return this.translate.instant(value);
  }

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {

      return;

    }

    this.intervalId = setInterval(() => {

      const announcements = this.visibleAnnouncements;

      if (announcements.length <= 1) {

        return;

      }

      this.currentIndex.update(

        index => (index + 1) % announcements.length

      );

    }, 5000);

  }

  ngOnDestroy(): void {

    if (this.intervalId) {

      clearInterval(this.intervalId);

    }

  }
}
