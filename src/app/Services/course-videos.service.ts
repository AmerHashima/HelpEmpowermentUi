import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor(private apiService: ApiService, private http: HttpClient) { }

  searchVideos(body: RequestBody): Observable<CourseVideo[]> {
    return this.apiService
      .query<ApiSearchResponse<CourseVideo>>('CourseVideos/search', body)
      .pipe(map((res) => res.data));
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
      .pipe(map((res) => res.data));
  }

  createVideo(body: CreateCourseVideoDto): Observable<CourseVideo> {
    return this.apiService
      .post<ApiResponse<CourseVideo>>('CourseVideos', body)
      .pipe(map((res) => res.data));
  }

  updateVideo(body: UpdateCourseVideoDto): Observable<CourseVideo> {
    return this.apiService
      .put<ApiResponse<CourseVideo>>('CourseVideos', body.oid, body)
      .pipe(map((res) => res.data));
  }

  deleteVideo(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('CourseVideos', id)
      .pipe(map((res) => res.data));
  }

  uploadVideoFile(courseVideoId: string, video: File, savePath: string = 'course-videos'): Observable<CourseVideo> {
    const formData = new FormData();
    formData.append('courseVideoId', courseVideoId);
    formData.append('video', video);
    formData.append('savePath', savePath);

    return this.http
      .post<ApiResponse<CourseVideo>>(`${this.baseUrl}/CourseVideos/upload`, formData)
      .pipe(map((res) => res.data));
  }

  getStreamUrl(videoUrl: string): string {
    return `${this.baseUrl}/CourseVideos/streamVideo/${encodeURIComponent(videoUrl)}`;
  }

  getAttachmentsByVideo(videoOid: string): Observable<CourseVideoAttachment[]> {
    return this.apiService
      .get<ApiResponse<CourseVideoAttachment[]>>(`CourseVideoAttachments/video/${videoOid}`)
      .pipe(map(res => res.data));
  }

  searchAttachments(body: RequestBody): Observable<CourseVideoAttachment[]> {
    return this.apiService
      .query<ApiSearchResponse<CourseVideoAttachment>>('CourseVideoAttachments/search', body)
      .pipe(map((res) => res.data ?? []));
  }

  createAttachment(body: CreateCourseVideoAttachmentDto): Observable<CourseVideoAttachment> {
    return this.apiService
      .post<ApiResponse<CourseVideoAttachment>>('CourseVideoAttachments', body)
      .pipe(map((res) => res.data));
  }

  updateAttachment(body: UpdateCourseVideoAttachmentDto): Observable<CourseVideoAttachment> {
    return this.apiService
      .put<ApiResponse<CourseVideoAttachment>>('CourseVideoAttachments', body.oid, body)
      .pipe(map((res) => res.data));
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
      .pipe(map((res) => res.data));
  }

  getAttachmentDownloadUrl(oid: string): string {
    return `${this.baseUrl}/CourseVideoAttachments/${oid}/download`;
  }
}
