import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class VideosComponent implements OnInit {
  private courseVideosService = inject(CourseVideosService);
  private shared = inject(Shared);

  isRTL = this.shared.isRtl;
  videos = signal<CourseVideo[]>([]);
  selectedVideo = signal<CourseVideo | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  selectedVideoUrl = computed(() => {
    const video = this.selectedVideo();
    return video ? this.courseVideosService.getStreamUrl(video.videoUrl) : null;
  });

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

  selectVideo(video: CourseVideo): void {
    this.selectedVideo.set(video);
  }

  getDisplayName(video: CourseVideo): string {
    return this.shared.isRtl() ? (video.nameAr || video.nameEn) : (video.nameEn || video.nameAr);
  }
}
