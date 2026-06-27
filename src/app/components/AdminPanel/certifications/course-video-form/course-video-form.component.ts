import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
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
    videoUploading = signal<boolean>(false);
    videoUploadProgress = signal<number>(0);
    videoUploadError = signal<string>('');
    attachmentUploading = signal<boolean>(false);
    attachmentUploadProgress = signal<number>(0);
    attachmentUploadError = signal<string>('');

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
        this.videoUploadProgress.set(0);
        this.videoUploadError.set('');
    }

    uploadVideoFile(): void {
        if (!this.videoId() || !this.selectedVideoFile || this.videoUploading()) {
            return;
        }

        const file = this.selectedVideoFile;
        this.videoUploading.set(true);
        this.videoUploadProgress.set(0);
        this.videoUploadError.set('');

        this.courseVideosService.uploadVideoFileWithProgress(this.videoId(), file).subscribe({
            next: (event) => this.handleVideoUploadEvent(event, file),
            error: () => {
                this.videoUploading.set(false);
                this.videoUploadError.set('Video upload failed. Please try again.');
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
        this.attachmentUploadProgress.set(0);
        this.attachmentUploadError.set('');
    }

    uploadAttachment(): void {
        if (!this.videoId() || !this.selectedAttachmentFile || this.attachmentUploading()) {
            return;
        }

        const value = this.attachmentForm.getRawValue();
        const file = this.selectedAttachmentFile;
        this.attachmentUploading.set(true);
        this.attachmentUploadProgress.set(0);
        this.attachmentUploadError.set('');

        this.courseVideosService
            .uploadAttachmentFileWithProgress(
                this.videoId(),
                file,
                value.fileTypeLookupId ?? '',
                value.savePath || 'course-videos/attachments'
            )
            .subscribe({
                next: (event) => {
                    this.handleAttachmentUploadEvent(event, file);
                },
                error: () => {
                    this.attachmentUploading.set(false);
                    this.attachmentUploadError.set('Attachment upload failed. Please try again.');
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

    formatFileSize(file: File | null): string {
        if (!file) {
            return '';
        }

        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = file.size;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex += 1;
        }

        return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
    }

    backToCourse(): void {
        // this.router.navigate(['/admin/certifications', this.courseId()]);
      this.router.navigate(

        ['/admin/certifications', this.courseId()],

        {

          queryParams: {

            tab: 'videos'

          }

        }

      );
    }

    private handleVideoUploadEvent(event: HttpEvent<unknown>, file: File): void {
        if (event.type === HttpEventType.UploadProgress) {
            this.videoUploadProgress.set(this.calculateUploadProgress(event.loaded, event.total, file.size));
            return;
        }

        if (event.type === HttpEventType.Response) {
            const video = this.extractResponseData<CourseVideo>(event.body);
            if (video) {
                this.patchVideo(video);
            }
            this.videoUploadProgress.set(100);
            this.videoUploading.set(false);
            this.selectedVideoFile = null;
        }
    }

    private handleAttachmentUploadEvent(event: HttpEvent<unknown>, file: File): void {
        if (event.type === HttpEventType.UploadProgress) {
            this.attachmentUploadProgress.set(this.calculateUploadProgress(event.loaded, event.total, file.size));
            return;
        }

        if (event.type === HttpEventType.Response) {
            this.attachmentUploadProgress.set(100);
            this.attachmentUploading.set(false);
            this.selectedAttachmentFile = null;
            this.loadAttachments(this.videoId());
        }
    }

    private calculateUploadProgress(loaded: number, total?: number, fallbackTotal?: number): number {
        const uploadTotal = total && total > 0 ? total : fallbackTotal;
        if (!uploadTotal) {
            return 0;
        }

        return Math.min(99, Math.round((loaded / uploadTotal) * 100));
    }

    private extractResponseData<T>(body: unknown): T | null {
        if (body && typeof body === 'object' && 'data' in body) {
            return (body as { data: T }).data;
        }

        return null;
    }
}
