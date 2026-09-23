import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { CourseTabContent, CourseTabKey } from '../models/course-tab-content';
import ApiService from '../shared/Services/ApiService/api.service';

@Injectable({ providedIn: 'root' })
export class CourseTabContentService {
  private readonly api = inject(ApiService);
  private readonly cache = new Map<string, Observable<CourseTabContent[]>>();

  getCourse(courseCode: string, includeDrafts = false): Observable<CourseTabContent[]> {
    const code = courseCode.trim().toUpperCase();
    const cacheKey = `${code}:${includeDrafts}`;
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

  getTab(courseCode: string, tabKey: CourseTabKey): Observable<CourseTabContent | null> {
    return this.getCourse(courseCode).pipe(
      map(tabs => tabs.find(tab => tab.tabKey === tabKey && tab.isEnabled) ?? null)
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

  invalidate(courseCode: string): void {
    const prefix = `${courseCode.trim().toUpperCase()}:`;
    [...this.cache.keys()].filter(key => key.startsWith(prefix)).forEach(key => this.cache.delete(key));
  }
}
