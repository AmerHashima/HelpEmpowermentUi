import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CertificationService } from '../../../../Services/certification.service';
import { CourseTabContentService } from '../../../../Services/course-tab-content.service';
import { CertificationDisplaySettings, CourseTabContent } from '../../../../models/course-tab-content';
import { defaultCertificationDisplaySettings } from '../../../../models/certification-display-settings';
import { FinishCertificationComponent } from '../../../ClientSide/finish-certification/finish-certification.component';

type AssetField = 'logoImage' | 'partnerLogoImage' | 'signatureImage' | 'checkerImage';
type UploadTarget = AssetField | 'performanceLevelsImage';

@Component({
  selector: 'app-certificate-settings-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FinishCertificationComponent],
  templateUrl: './certificate-settings-editor.component.html',
  styleUrl: './certificate-settings-editor.component.scss'
})
export class CertificateSettingsEditorComponent {
  private route = inject(ActivatedRoute);
  private certifications = inject(CertificationService);
  private contentService = inject(CourseTabContentService);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly uploading = signal<UploadTarget | null>(null);
  readonly previewOpen = signal(false);
  readonly error = signal('');
  readonly courseCode = signal('');
  readonly settings = signal<CertificationDisplaySettings>(defaultCertificationDisplaySettings());
  private row: CourseTabContent | null = null;
  readonly certificateAssets: Array<{ key: AssetField; label: string }> = [
    { key: 'logoImage', label: 'Main logo' },
    { key: 'partnerLogoImage', label: 'Another logo' },
    { key: 'signatureImage', label: 'Signature' },
    { key: 'checkerImage', label: 'Checker image' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return this.fail('Course id is missing.');
    this.certifications.getCertification(id).subscribe({
      next: course => {
        const code = course.courseCode?.trim();
        if (!code) return this.fail('This course does not have a course code.');
        this.courseCode.set(code);
        this.contentService.getCourse(code, true).subscribe({
          next: rows => {
            this.row = rows.find(x => x.tabKey === 'certificate-settings') ?? null;
            const saved = this.row?.content.certificationSettings;
            this.settings.set(saved ?? defaultCertificationDisplaySettings(code));
            this.loading.set(false);
          },
          error: () => this.fail('Could not load certificate settings.')
        });
      },
      error: () => this.fail('Could not load the course.')
    });
  }

  save(): void {
    const levels = this.settings().examResult.levels;
    if (levels.some(x => x.minimumPercentage < 0 || x.minimumPercentage > 100)) {
      this.error.set('Performance percentages must be between 0 and 100.');
      return;
    }
    this.saving.set(true);
    this.error.set('');
    const payload = {
      courseCode: this.courseCode(), tabKey: 'certificate-settings' as const,
      isEnabled: true, orderNo: 100, status: 'Published' as const,
      content: {
        certificationSettings: this.settings(),
        banner: { en: { titlePart1: '', titlePart2: '', description: '' }, ar: { titlePart1: '', titlePart2: '', description: '' }, mediaUrl: '', mediaType: 'image' as const },
        sections: []
      }
    };
    this.contentService.save(payload, 'Certificate and result settings saved successfully.').subscribe({
      next: saved => { this.row = saved; this.saving.set(false); },
      error: () => { this.error.set('Could not save the settings.'); this.saving.set(false); }
    });
  }

  upload(event: Event, field: AssetField): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0]; input.value = '';
    if (!file || this.uploading()) return;
    this.uploading.set(field);
    this.contentService.uploadCertificateAsset(this.courseCode(), file).subscribe({
      next: response => {
        this.settings().certificate[field] = response.fileName;
        this.settings.update(value => ({ ...value }));
        this.uploading.set(null);
      },
      error: () => { this.error.set('Could not upload the image.'); this.uploading.set(null); }
    });
  }

  uploadPerformanceLevelsImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0]; input.value = '';
    if (!file || this.uploading()) return;
    this.uploading.set('performanceLevelsImage');
    this.contentService.uploadCertificateAsset(this.courseCode(), file).subscribe({
      next: response => {
        this.settings().examResult.performanceLevelsImage = response.fileName;
        this.settings.update(value => ({ ...value }));
        this.uploading.set(null);
      },
      error: () => { this.error.set('Could not upload the performance levels image.'); this.uploading.set(null); }
    });
  }

  imageUrl(value: string): string {
    return value && !value.includes('/') && !value.includes('\\')
      ? this.contentService.getCertificateAssetUrl(value) : value;
  }

  assetValue(field: AssetField): string { return this.settings().certificate[field]; }
  setAssetValue(field: AssetField, value: string): void {
    this.settings().certificate[field] = value;
    this.settings.update(settings => ({ ...settings }));
  }

  openPreview(): void { this.previewOpen.set(true); }
  closePreview(): void { this.previewOpen.set(false); }

  private fail(message: string): void { this.error.set(message); this.loading.set(false); }
}
