import { Component, inject, signal, computed, OnInit, OnDestroy, HostListener, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CourseVideosService } from '../../../Services/course-videos.service';
import { Shared } from '../../../shared/Services/shared/shared';
import { CourseVideo } from '../../../models/course-video';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss',
})
export class VideosComponent implements OnInit, OnDestroy {
  private courseVideosService = inject(CourseVideosService);
  private shared = inject(Shared);
  private platformId = inject(PLATFORM_ID);

  isRTL = this.shared.isRtl;
  videos = signal<CourseVideo[]>([]);
  selectedVideo = signal<CourseVideo | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  isProtected = signal(false);

  selectedVideoUrl = computed(() => {
    const video = this.selectedVideo();
    return video ? this.courseVideosService.getStreamUrl(video.videoUrl) : null;
  });

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isProtected.set(document.hidden);
    }
  }

  @HostListener('window:blur')
  onWindowBlur(): void {
    this.isProtected.set(true);
  }

  @HostListener('window:focus')
  onWindowFocus(): void {
    this.isProtected.set(false);
  }

  ngOnInit(): void {
    this.courseVideosService.getAllVideos().subscribe({
      next: (data) => {
        this.videos.set(data);
        if (data.length > 0) {
          this.selectedVideo.set(data[0]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load videos.');
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.isProtected.set(false);
  }

  selectVideo(video: CourseVideo): void {
    this.selectedVideo.set(video);
  }

  getDisplayName(video: CourseVideo): string {
    return this.shared.isRtl() ? (video.nameAr || video.nameEn) : (video.nameEn || video.nameAr);
  }
}
