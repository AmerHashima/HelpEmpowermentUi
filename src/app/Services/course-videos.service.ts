import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpXhrBackend } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import ApiService from '../shared/Services/ApiService/api.service';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { RequestBody } from '../models/rquest';
import {
  CourseVideo,
  CourseVideoAttachment,
  CreateCourseVideoAttachmentDto,
  CreateCourseVideoDto,
  UpdateCourseVideoAttachmentDto,
  UpdateCourseVideoDto,
} from '../models/course-video';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseVideosService {
  private readonly baseUrl = environment.baseUrl;
  private progressHttp: HttpClient | null = null;

  constructor(private apiService: ApiService, private http: HttpClient, private injector: Injector) { }

  searchVideos(body: RequestBody): Observable<CourseVideo[]> {
    return this.apiService
      .query<ApiSearchResponse<CourseVideo>>('CourseVideos/search', body)
      .pipe(map((res) => this.extractSearchData(res).map((video) => this.normalizeCourseVideo(video))));
  }

  // getAllVideos(): Observable<CourseVideo[]> {
  //   const body: RequestBody = {
  //     filters: [],
  //     sort: [{ sortBy: 'orderNo', sortDirection: 'asc' }],
  //     pagination: { getAll: true, pageNumber: 0, pageSize: 0 },
  //     columns: [],
  //   };
  //   return this.searchVideos(body);
  // }

  getAllVideos(certId: string): Observable<CourseVideo[]> {
    const body: RequestBody = {
      filters: [
        {
          propertyName: "courseOid",
          value: certId,
          operation: 0
        }
      ],
      sort: [{ sortBy: 'orderNo', sortDirection: 'asc' }],
      pagination: { getAll: true, pageNumber: 0, pageSize: 0 },
      columns: [],
    };
    return this.searchVideos(body);
  }

  getVideoById(id: string): Observable<CourseVideo> {
    return this.apiService
      .getSingle<ApiResponse<CourseVideo>>('CourseVideos', id)
      .pipe(map((res) => this.normalizeCourseVideo(this.extractApiData(res))));
  }

  createVideo(body: CreateCourseVideoDto): Observable<CourseVideo> {
    return this.apiService
      .post<ApiResponse<CourseVideo>>('CourseVideos', body)
      .pipe(map((res) => this.normalizeCourseVideo(this.extractApiData(res))));
  }

  updateVideo(body: UpdateCourseVideoDto): Observable<CourseVideo> {
    return this.apiService
      .put<ApiResponse<CourseVideo>>('CourseVideos', body.oid, body)
      .pipe(map((res) => this.normalizeCourseVideo(this.extractApiData(res))));
  }

  deleteVideo(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('CourseVideos', id)
      .pipe(map((res) => res.data));
  }

  uploadVideoFile(courseVideoId: string, video: File): Observable<CourseVideo> {
    const formData = new FormData();
    formData.append('courseVideoId', courseVideoId);
    formData.append('video', video);

    return this.http
      .post<ApiResponse<CourseVideo>>(`${this.baseUrl}/CourseVideos/upload`, formData)
      .pipe(map((res) => this.normalizeCourseVideo(this.extractApiData(res))));
  }

  uploadVideoFileWithProgress(
    courseVideoId: string,
    video: File
  ): Observable<HttpEvent<ApiResponse<CourseVideo>>> {
    const formData = new FormData();
    formData.append('courseVideoId', courseVideoId);
    formData.append('video', video);

    return this.getProgressHttp().post<ApiResponse<CourseVideo>>(`${this.baseUrl}/CourseVideos/upload`, formData, {
      headers: this.getUploadHeaders(),
      observe: 'events',
      reportProgress: true,
    });
  }

  getStreamUrl(videoUrl: string): string {
    const normalizedVideoUrl = this.normalizeVideoPath(videoUrl);
    if (!normalizedVideoUrl) {
      return '';
    }

    if (/^https?:\/\//i.test(normalizedVideoUrl)) {
      return normalizedVideoUrl;
    }

    if (normalizedVideoUrl.startsWith('/api/')) {
      return `${this.getApiOrigin()}${normalizedVideoUrl}`;
    }

    if (normalizedVideoUrl.startsWith('/')) {
      return `${this.baseUrl}${normalizedVideoUrl}`;
    }

    return `${this.baseUrl}/CourseVideos/streamVideo/${encodeURIComponent(normalizedVideoUrl)}`;
  }

  getAttachmentsByVideo(videoOid: string): Observable<CourseVideoAttachment[]> {
    return this.apiService
      .get<ApiResponse<CourseVideoAttachment[]>>(`CourseVideoAttachments/video/${videoOid}`)
      .pipe(map(res => this.extractApiData(res).map((attachment) => this.normalizeAttachment(attachment))));
  }

  searchAttachments(body: RequestBody): Observable<CourseVideoAttachment[]> {
    return this.apiService
      .query<ApiSearchResponse<CourseVideoAttachment>>('CourseVideoAttachments/search', body)
      .pipe(map((res) => this.extractSearchData(res).map((attachment) => this.normalizeAttachment(attachment))));
  }

  createAttachment(body: CreateCourseVideoAttachmentDto): Observable<CourseVideoAttachment> {
    return this.apiService
      .post<ApiResponse<CourseVideoAttachment>>('CourseVideoAttachments', body)
      .pipe(map((res) => this.normalizeAttachment(this.extractApiData(res))));
  }

  updateAttachment(body: UpdateCourseVideoAttachmentDto): Observable<CourseVideoAttachment> {
    return this.apiService
      .put<ApiResponse<CourseVideoAttachment>>('CourseVideoAttachments', body.oid, body)
      .pipe(map((res) => this.normalizeAttachment(this.extractApiData(res))));
  }

  deleteAttachment(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('CourseVideoAttachments', id)
      .pipe(map((res) => res.data));
  }

  uploadAttachmentFile(
    courseVideoOid: string,
    file: File,
    fileTypeLookupId: string = '',
    savePath: string = 'course-videos/attachments'
  ): Observable<CourseVideoAttachment> {
    const formData = new FormData();
    formData.append('courseVideoOid', courseVideoOid);
    formData.append('file', file);
    formData.append('savePath', savePath);
    if (fileTypeLookupId) {
      formData.append('fileTypeLookupId', fileTypeLookupId);
    }

    return this.http
      .post<ApiResponse<CourseVideoAttachment>>(`${this.baseUrl}/CourseVideoAttachments/upload`, formData)
      .pipe(map((res) => this.normalizeAttachment(this.extractApiData(res))));
  }

  uploadAttachmentFileWithProgress(
    courseVideoOid: string,
    file: File,
    fileTypeLookupId: string = '',
    savePath: string = 'course-videos/attachments'
  ): Observable<HttpEvent<ApiResponse<CourseVideoAttachment>>> {
    const formData = new FormData();
    formData.append('courseVideoOid', courseVideoOid);
    formData.append('file', file);
    formData.append('savePath', savePath);
    if (fileTypeLookupId) {
      formData.append('fileTypeLookupId', fileTypeLookupId);
    }

    return this.getProgressHttp().post<ApiResponse<CourseVideoAttachment>>(
      `${this.baseUrl}/CourseVideoAttachments/upload`,
      formData,
      {
        headers: this.getUploadHeaders(),
        observe: 'events',
        reportProgress: true,
      }
    );
  }

  getAttachmentDownloadUrl(oid: string): string {
    return `${this.baseUrl}/CourseVideoAttachments/${oid}/download`;
  }

  getAttachmentAccessUrl(attachment: CourseVideoAttachment): string {
    const normalizedAttachment = this.normalizeAttachment(attachment);
    const fileUrl = normalizedAttachment.fileUrl;

    if (/^https?:\/\//i.test(fileUrl)) {
      return fileUrl;
    }

    if (fileUrl.startsWith('/api/')) {
      return `${this.getApiOrigin()}${fileUrl}`;
    }

    if (fileUrl.startsWith('/')) {
      return `${this.baseUrl}${fileUrl}`;
    }

    return this.getAttachmentDownloadUrl(normalizedAttachment.oid);
  }

  private getUploadHeaders(): HttpHeaders {
    if (typeof window === 'undefined') {
      return new HttpHeaders();
    }

    const token = localStorage.getItem('studentToken') ?? localStorage.getItem('adminToken');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  private getProgressHttp(): HttpClient {
    this.progressHttp ??= new HttpClient(this.injector.get(HttpXhrBackend));
    return this.progressHttp;
  }

  normalizeCourseVideo(video: CourseVideo): CourseVideo {
    const rawVideo = video as CourseVideo & {
      VideoUrl?: string;
      videoURL?: string;
      FileName?: string;
      fileName?: string;
    };
    const videoUrl =
      rawVideo.videoUrl ??
      rawVideo.VideoUrl ??
      rawVideo.videoURL ??
      rawVideo.fileName ??
      rawVideo.FileName ??
      '';

    return {
      ...video,
      videoUrl: this.normalizeVideoPath(videoUrl),
    };
  }

  normalizeAttachment(attachment: CourseVideoAttachment): CourseVideoAttachment {
    const rawAttachment = attachment as CourseVideoAttachment & {
      FileName?: string;
      FileUrl?: string;
      AttachmentUrl?: string;
      Url?: string;
    };
    const fileName =
      rawAttachment.fileName ??
      rawAttachment.FileName ??
      this.fileNameFromUrl(rawAttachment.fileUrl ?? rawAttachment.FileUrl ?? '') ??
      '';
    const fileUrl =
      rawAttachment.fileUrl ??
      rawAttachment.FileUrl ??
      rawAttachment.AttachmentUrl ??
      rawAttachment.Url ??
      fileName;

    return {
      ...attachment,
      fileName,
      fileUrl: this.normalizeFilePath(fileUrl),
    };
  }

  normalizeVideoPath(videoUrl: string | null | undefined): string {
    if (!videoUrl) {
      return '';
    }

    const trimmed = videoUrl.trim();
    if (!trimmed) {
      return '';
    }

    const streamSegment = '/CourseVideos/streamVideo/';
    const streamIndex = trimmed.indexOf(streamSegment);
    if (streamIndex >= 0) {
      const encodedName = trimmed.slice(streamIndex + streamSegment.length);
      return this.decodePath(encodedName);
    }

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    const withoutApiPrefix = trimmed.replace(/^\/?api\/CourseVideos\/streamVideo\//i, '');
    return this.decodePath(withoutApiPrefix.replace(/^\/+/, ''));
  }

  normalizeFilePath(fileUrl: string | null | undefined): string {
    if (!fileUrl) {
      return '';
    }

    const trimmed = fileUrl.trim();
    if (!trimmed) {
      return '';
    }

    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) {
      return this.decodePath(trimmed);
    }

    return this.decodePath(trimmed.replace(/^\/+/, ''));
  }

  private extractApiData<T>(response: ApiResponse<T> | ({ Data?: T } & Partial<ApiResponse<T>>)): T {
    const responseBody = response as Partial<ApiResponse<T>> & { Data?: T };
    return (responseBody.data ?? responseBody.Data) as T;
  }

  private extractSearchData<T>(response: ApiSearchResponse<T> | ({ Data?: T[] } & Partial<ApiSearchResponse<T>>)): T[] {
    const responseBody = response as Partial<ApiSearchResponse<T>> & { Data?: T[] };
    return responseBody.data ?? responseBody.Data ?? [];
  }

  private decodePath(path: string): string {
    try {
      return decodeURIComponent(path);
    } catch {
      return path;
    }
  }

  private getApiOrigin(): string {
    try {
      return new URL(this.baseUrl).origin;
    } catch {
      return '';
    }
  }

  private fileNameFromUrl(fileUrl: string): string | null {
    if (!fileUrl) {
      return null;
    }

    const normalized = fileUrl.split('?')[0].split('#')[0].replace(/\\/g, '/');
    return normalized.split('/').pop() || null;
  }
}
