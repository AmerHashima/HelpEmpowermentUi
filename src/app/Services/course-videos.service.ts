import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import ApiService from '../shared/Services/ApiService/api.service';
import { ApiSearchResponse } from '../models/apiResponse';
import { RequestBody } from '../models/rquest';
import { CourseVideo } from '../models/course-video';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseVideosService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private apiService: ApiService) {}

  searchVideos(body: RequestBody): Observable<CourseVideo[]> {
    return this.apiService
      .query<ApiSearchResponse<CourseVideo>>('CourseVideos/search', body)
      .pipe(map((res) => res.data));
  }

  getAllVideos(): Observable<CourseVideo[]> {
    const body: RequestBody = {
      filters: [],
      sort: [{ sortBy: 'orderNo', sortDirection: 'asc' }],
      pagination: { getAll: true, pageNumber: 0, pageSize: 0 },
      columns: [],
    };
    return this.searchVideos(body);
  }

  getStreamUrl(videoUrl: string): string {
    return `${this.baseUrl}/CourseVideos/streamVideo/${encodeURIComponent(videoUrl)}`;
  }
}
