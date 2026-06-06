import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseVideosService } from '../../../../Services/course-videos.service';
import {
  CourseVideo,
  CourseVideoAttachment,
  CreateCourseVideoDto,
  UpdateCourseVideoDto,
} from '../../../../models/course-video';

@Component({
  selector: 'app-course-video-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './course-video-form.component.html',
  styleUrl: './course-video-form.component.scss',
})
export class CourseVideoFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseVideosService = inject(CourseVideosService);

  courseId = signal<string>('');
  videoId = signal<string>('');
  loading = signal<boolean>(false);
  attachmentsLoading = signal<boolean>(false);
  attachments = signal<CourseVideoAttachment[]>([]);

  selectedVideoFile: File | null = null;
  selectedAttachmentFile: File | null = null;

  form = this.fb.group({
    nameEn: [''],
    nameAr: [''],
    videoUrl: [''],
    descriptionEn: [''],
    descriptionAr: [''],
    durationSeconds: [0],
    orderNo: [0],
    videoTypeLookupId: [''],
    isPreview: [false],
    isActive: [true],
  });

  attachmentForm = this.fb.group({
    fileTypeLookupId: [''],
    savePath: ['course-videos/attachments'],
  });

  isEdit = computed(() => !!this.videoId());

  constructor() {
    effect(() => {
      const courseId = this.route.snapshot.paramMap.get('id') ?? '';
      const videoId = this.route.snapshot.paramMap.get('videoId') ?? '';
      this.courseId.set(courseId);
      this.videoId.set(videoId);

      if (videoId) {
        this.loadVideo(videoId);
        this.loadAttachments(videoId);
      }
    });
  }

  private loadVideo(id: string): void {
    this.loading.set(true);
    this.courseVideosService.getVideoById(id).subscribe({
      next: (video) => {
        this.patchVideo(video);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private patchVideo(video: CourseVideo): void {
    this.form.patchValue({
      nameEn: video.nameEn ?? '',
      nameAr: video.nameAr ?? '',
      videoUrl: video.videoUrl ?? '',
      descriptionEn: video.descriptionEn ?? '',
      descriptionAr: video.descriptionAr ?? '',
      durationSeconds: video.durationSeconds ?? 0,
      orderNo: video.orderNo ?? 0,
      videoTypeLookupId: video.videoTypeLookupId ?? '',
      isPreview: video.isPreview,
      isActive: video.isActive,
    });
  }

  private loadAttachments(videoId: string): void {
    this.attachmentsLoading.set(true);
    this.courseVideosService.getAttachmentsByVideo(videoId).subscribe({
      next: (attachments) => {
        this.attachments.set(attachments ?? []);
        this.attachmentsLoading.set(false);
      },
      error: () => {
        this.attachments.set([]);
        this.attachmentsLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (!this.courseId()) {
      return;
    }

    const value = this.form.getRawValue();
    const payload: CreateCourseVideoDto = {
      courseOid: this.courseId(),
      nameEn: value.nameEn ?? null,
      nameAr: value.nameAr ?? null,
      videoUrl: value.videoUrl ?? null,
      descriptionEn: value.descriptionEn ?? null,
      descriptionAr: value.descriptionAr ?? null,
      durationSeconds: Number(value.durationSeconds ?? 0),
      orderNo: Number(value.orderNo ?? 0),
      videoTypeLookupId: value.videoTypeLookupId || null,
      isPreview: !!value.isPreview,
      isActive: !!value.isActive,
    };

    this.loading.set(true);

    if (this.isEdit()) {
      const updatePayload: UpdateCourseVideoDto = {
        oid: this.videoId(),
        ...payload,
      };

      this.courseVideosService.updateVideo(updatePayload).subscribe({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
      return;
    }

    this.courseVideosService.createVideo(payload).subscribe({
      next: (created) => {
        this.loading.set(false);
        this.router.navigate(['/admin/certifications', this.courseId(), 'videos', created.oid, 'edit']);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onVideoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedVideoFile = input.files?.[0] ?? null;
  }

  uploadVideoFile(): void {
    if (!this.videoId() || !this.selectedVideoFile) {
      return;
    }

    this.courseVideosService.uploadVideoFile(this.videoId(), this.selectedVideoFile).subscribe({
      next: (video) => {
        this.patchVideo(video);
        this.selectedVideoFile = null;
      },
    });
  }

  hasExistingVideo(): boolean {
    const videoUrl = this.form.get('videoUrl')?.value;
    return !!videoUrl;
  }

  getExistingVideoStreamUrl(): string {
    const videoUrl = this.form.get('videoUrl')?.value ?? '';
    if (!videoUrl) {
      return '';
    }
    return this.courseVideosService.getStreamUrl(videoUrl);
  }

  onAttachmentFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedAttachmentFile = input.files?.[0] ?? null;
  }

  uploadAttachment(): void {
    if (!this.videoId() || !this.selectedAttachmentFile) {
      return;
    }

    const value = this.attachmentForm.getRawValue();
    this.courseVideosService
      .uploadAttachmentFile(
        this.videoId(),
        this.selectedAttachmentFile,
        value.fileTypeLookupId ?? '',
        value.savePath || 'course-videos/attachments'
      )
      .subscribe({
        next: () => {
          this.selectedAttachmentFile = null;
          this.loadAttachments(this.videoId());
        },
      });
  }

  onDeleteAttachment(attachment: CourseVideoAttachment): void {
    if (!attachment?.oid) {
      return;
    }

    this.courseVideosService.deleteAttachment(attachment.oid).subscribe({
      next: () => this.loadAttachments(this.videoId()),
    });
  }

  getAttachmentDownloadUrl(attachment: CourseVideoAttachment): string {
    return this.courseVideosService.getAttachmentDownloadUrl(attachment.oid);
  }

  backToCourse(): void {
    this.router.navigate(['/admin/certifications', this.courseId()]);
  }
}
