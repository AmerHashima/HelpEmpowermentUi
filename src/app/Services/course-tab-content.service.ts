import { Injectable, inject, signal } from '@angular/core';
import { Observable, Subject, catchError, filter, map, shareReplay, startWith, switchMap, throwError } from 'rxjs';
import { CourseTabContent, CourseTabKey } from '../models/course-tab-content';
import ApiService from '../shared/Services/ApiService/api.service';

@Injectable({ providedIn: 'root' })
export class CourseTabContentService {
  private readonly api = inject(ApiService);
  private readonly cache = new Map<string, Observable<CourseTabContent[]>>();
  private readonly invalidated = new Subject<string>();
  /** Increments after saved course content so mounted public sections can reload it. */
  readonly contentRevision = signal(0);

  getCourse(courseCode: string, includeDrafts = false, forceRefresh = false): Observable<CourseTabContent[]> {
    const code = courseCode.trim().toUpperCase();
    const cacheKey = `${code}:${includeDrafts}`;
    if (forceRefresh) this.cache.delete(cacheKey);
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const statusQuery = includeDrafts ? '?status=all' : '';
    const request = this.api.get<CourseTabContent[]>(
      `course-tab-contents/${encodeURIComponent(code)}${statusQuery}`
    ).pipe(
      catchError(error => {
        this.cache.delete(cacheKey);
        return throwError(() => error);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );
    this.cache.set(cacheKey, request);
    return request;
  }

  getTab(courseCode: string, tabKey: CourseTabKey, forceRefresh = false): Observable<CourseTabContent | null> {
    return this.getCourse(courseCode, false, forceRefresh).pipe(
      map(tabs => tabs.find(tab => tab.tabKey === tabKey && tab.isEnabled) ?? null)
    );
  }

  /**
   * Use in public pages that stay mounted while an administrator saves content.
   * A normal getTab is intentionally one-shot and cached; this stream reloads
   * only when the same course's content is invalidated after a successful save.
   */
  watchTab(courseCode: string, tabKey: CourseTabKey): Observable<CourseTabContent | null> {
    const code = courseCode.trim().toUpperCase();
    return this.invalidated.pipe(
      filter(changedCode => changedCode === code),
      startWith(code),
      switchMap(() => this.getTab(code, tabKey, true))
    );
  }

  save(
    tab: Omit<CourseTabContent, 'oid' | 'updatedAt'>,
    successMessage = 'Website content saved successfully.'
  ): Observable<CourseTabContent> {
    return this.api.put<CourseTabContent>(
      'course-tab-contents',
      '',
      tab,
      successMessage
    ).pipe(
      map(saved => {
        this.invalidate(saved.courseCode);
        return saved;
      })
    );
  }

  uploadInstructorImage(courseCode: string, image: File): Observable<{ fileName: string }> {
    return this.api.uploadFile<{ fileName: string }>(
      `course-tab-contents/${encodeURIComponent(courseCode.trim())}/instructor-image`,
      image,
      'image',
      'Instructor image uploaded successfully.'
    );
  }

  uploadSocialProofImage(courseCode: string, image: File): Observable<{ fileName: string }> {
    return this.api.uploadFile<{ fileName: string }>(
      `course-tab-contents/${encodeURIComponent(courseCode.trim())}/social-proof-image`,
      image,
      'image',
      'Learner image uploaded successfully.'
    );
  }

  getSocialProofImageUrl(fileName: string): string {
    return this.api.getFileUrl(`course-tab-contents/social-proof-images/${encodeURIComponent(fileName)}`);
  }

  getInstructorImageUrl(fileName: string): string {
    return this.api.getFileUrl(`course-tab-contents/instructor-images/${encodeURIComponent(fileName)}`);
  }

  uploadCertificateAsset(courseCode: string, image: File): Observable<{ fileName: string }> {
    return this.api.uploadFile<{ fileName: string }>(
      `course-tab-contents/${encodeURIComponent(courseCode.trim())}/certificate-asset`,
      image,
      'image',
      'Certificate image uploaded successfully.'
    );
  }

  getCertificateAssetUrl(fileName: string): string {
    return this.api.getFileUrl(`course-tab-contents/certificate-assets/${encodeURIComponent(fileName)}`);
  }

  invalidate(courseCode: string): void {
    const code = courseCode.trim().toUpperCase();
    const prefix = `${code}:`;
    [...this.cache.keys()].filter(key => key.startsWith(prefix)).forEach(key => this.cache.delete(key));
    this.contentRevision.update(revision => revision + 1);
    this.invalidated.next(code);
  }
}
