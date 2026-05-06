

import {
  Component,
  inject,
  computed,
  signal,
  HostListener,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  effect
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, map, catchError, of, startWith, distinctUntilChanged, tap, EMPTY } from 'rxjs';
import { StudentService } from '../../../Services/student-service.service';
import { CourseVideosService } from '../../../Services/course-videos.service';
import { Shared } from '../../../shared/Services/shared/shared';
import { CourseVideo } from '../../../models/course-video';
import { ToastingMessagesService } from '../../../shared/Services/ToastingMessages/toasting-messages.service';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss',
})
export class VideosComponent {
  @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;
  // 🔧 injections
  private courseVideosService = inject(CourseVideosService);
  private toasting = inject(ToastingMessagesService);
  private studentService = inject(StudentService);
  private shared = inject(Shared);
  private platformId = inject(PLATFORM_ID);

  lessonsWatched = this.studentService.completedLessonsInCourse;
  totalLessons = this.studentService.totalLessonsInCourse;
  isRTL = this.shared.isRtl;
  certification = this.shared.currentCertificationObject;

  isProtected = signal(false);

  videosState = toSignal(
    toObservable(this.certification).pipe(
      distinctUntilChanged((a, b) => a?.oid === b?.oid),
      switchMap(cert => {
        if (!cert?.oid) {
          return of({
            data: [] as CourseVideo[],
            loading: false,
            error: 'No certification selected'
          });
        }

        return this.courseVideosService.getAllVideos(cert.oid).pipe(
          map(data => ({
            data,
            loading: false,
            error: null as string | null
          })),
          startWith({
            data: [] as CourseVideo[],
            loading: true,
            error: null
          }),
          catchError(() =>
            of({
              data: [],
              loading: false,
              error: 'Failed to load videos'
            })
          )
        );
      })
    ),
    {
      initialValue: {
        data: [] as CourseVideo[],
        loading: true,
        error: null as string | null
      }
    }
  );

  videos = computed(() => this.videosState().data);
  loading = computed(() => this.videosState().loading);
  error = computed(() => this.videosState().error);

  selectedVideo = signal<CourseVideo | null>(null);
  private initialized = false;

  constructor() {
    effect(() => {
      const vids = this.videos();
      const completed = this.lessonsWatched() ?? 0;

      if (!vids.length || this.initialized) return;

      const nextVideo =
        vids.find(v => (v.orderNo ?? 0) === completed + 1)
        ?? vids[vids.length - 1];

      this.selectedVideo.set(nextVideo);
      this.initialized = true;
    });

    effect(() => {
      const video = this.selectedVideo();
      this.shared.currentVideoOid.set(video?.oid ?? '');
    });
  }


  playVideo() {
    const video = this.videoRef?.nativeElement;

    if (!video) return;

    video.muted = true;
    video.play().catch(() => {
      this.toasting.showToast('Autoplay failed. Please click play to start the video.', 'info');});
  }

  selectedVideoUrl = computed(() => {
    const video = this.selectedVideo();
    return video
      ? this.courseVideosService.getStreamUrl(video.videoUrl)
      : null;
  });

  currentIndex = computed(() => {
    const vids = this.videos();
    const current = this.selectedVideo();

    const index = vids.findIndex(v => v.oid === current?.oid);
    return index === -1 ? 0 : index;
  });

  playPrevious(): void {
    const index = this.currentIndex();

    if (index > 0) {
      const prevVideo = this.videos()[index - 1];
      this.selectedVideo.set(prevVideo);
    }
  }
  playNext(): void {
    const index = this.currentIndex();
    const vids = this.videos();

    if (index < vids.length - 1) {
      const nextVideo = vids[index + 1];

      if (!this.isLocked(nextVideo)) {
        this.selectedVideo.set(nextVideo);
      } else {
        this.showLockedMessage();
      }
    }
  }
  selectVideo(video: CourseVideo): void {
    const completed = this.lessonsWatched() ?? 0;
    const order = video.orderNo ?? 0;

    const isUnlocked = order <= completed + 1;

    if (isUnlocked) {
      this.selectedVideo.set(video);
    } else {
      this.showLockedMessage();
    }
  }

  onVideoEnded(): void {
    const index = this.currentIndex();
    const vids = this.videos();

    if (index < vids.length - 1) {
      this.playNext();
      setTimeout(() => this.playVideo(), 0);
    } else {
      this.toasting.showToast('You completed the course 🎉', 'success');
    }
  }


  onVideoPlay() {
    const video = this.selectedVideo();
    if (!video) return;

    const order = video.orderNo ?? 0;
    const completed = this.lessonsWatched() ?? 0;

    if (order <= completed) return;

    if (order === completed + 1) {
      this.studentService.updateStudentProgress(order).subscribe();
    }
  }

  showLockedMessage() {
    this.toasting.showToast('Please watch previous lessons first.', 'warning');
  }



  getDisplayName(video: CourseVideo): string {
    return this.isRTL()
      ? (video.nameAr || video.nameEn)
      : (video.nameEn || video.nameAr);
  }

  //Helper

  canPlayNext = computed(() => {
    const vids = this.videos();
    const index = this.currentIndex();

    if (index >= vids.length - 1) return false;

    const next = vids[index + 1];
    return next && !this.isLocked(next);
  });

  isLocked(video: CourseVideo): boolean {
    const completed = this.lessonsWatched() ?? 0;
    const order = video.orderNo ?? 0;

    return order > completed + 1;
  }
  isWatched(video: CourseVideo): boolean {
    const completed = this.lessonsWatched() ?? 0;
    const order = video.orderNo ?? 0;

    return order <= completed;
  }

  isCurrent(video: CourseVideo): boolean {
    return this.selectedVideo()?.oid === video.oid;
  }


  //  HostListeners (Protection)

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
}
