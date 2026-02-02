import { Injectable } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { APICertification, APIExam, Certification, courseExam } from '../models/certification';
import { RequestBody } from '../models/rquest';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {
  constructor(private apiService: ApiService) { }

  // certification api calls
  getCertifications(): Observable<APICertification[]> {
    return this.apiService.get<ApiResponse<APICertification[]>>('Courses').pipe(
      map((response: ApiResponse<APICertification[]>) => {
        if (!response.success) {
          throw new Error(response.message || 'API failed to load certifications');
        }
        return response.data;
      })
    );
  }


  createCertification(body: Certification): Observable<APICertification> {
    return this.apiService
      .post<ApiResponse<APICertification>>('Courses', body)
      .pipe(
        map((response: ApiResponse<APICertification>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create certification';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  getCertification(id: string): Observable<APICertification> {
    return this.apiService
      .getSingle<ApiResponse<APICertification>>('Courses', id)
      .pipe(
        map((response: ApiResponse<APICertification>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load certification';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  getCertificationExams(id: string): Observable<APIExam[]> {
    return this.apiService
      .getSingle<ApiResponse<APIExam[]>>('CoursesMasterExams/course', id)
      .pipe(
        map((response: ApiResponse<APIExam[]>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load CERTIFICATION EXAMS';
            throw new Error(msg);
          }
          console.log('response.data', response.data);
          return response.data;
        })
      );
  }

  updateCertification(id: string, body: Certification): Observable<APICertification> {
    return this.apiService
      .put<ApiResponse<APICertification>>('Courses', id, body)
      .pipe(
        map((response: ApiResponse<APICertification>) => {
          console.log('response', response);
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update certification';
            throw new Error(msg);
          }

          return response.data;
        })
      );
  }

  deleteCertification(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('Courses', id)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete certification';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  search(body: RequestBody): Observable<{ certifications: APICertification[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APICertification>>('Courses/search', body)
      .pipe(
        map((response: ApiSearchResponse<APICertification>) => {
          if (!response.success) {
            const msg = response.message || 'API failed to query';
            throw new Error(msg);
          }
          return {
            certifications: response.data ?? [],
            total: response.totalPages ?? 0,
          };
        })
      );
  }

  //ecam api calls


  createExam(body: courseExam): Observable<APIExam> {
    return this.apiService
      .post<ApiResponse<APIExam>>('CoursesMasterExams', body)
      .pipe(
        map((response: ApiResponse<APIExam>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create exam';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  getExam(id: string): Observable<APIExam> {
    return this.apiService
      .getSingle<ApiResponse<APIExam>>('CoursesMasterExams', id)
      .pipe(
        map((response: ApiResponse<APIExam>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load exam';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  updateExam(id: string, body: courseExam): Observable<APIExam> {
    return this.apiService
      .put<ApiResponse<APIExam>>('CoursesMasterExams', id, body)
      .pipe(
        map((response: ApiResponse<APIExam>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update exam';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  deleteExam(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('CoursesMasterExams', id)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete certification';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  searchExams(body: RequestBody): Observable<{ certifications: APIExam[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APIExam>>('CoursesMasterExams/search', body)
      .pipe(
        map((response: ApiSearchResponse<APIExam>) => {
          if (!response.success) {
            const msg = response.message || 'API failed to query';
            throw new Error(msg);
          }
          return {
            certifications: response.data ?? [],
            total: response.totalPages ?? 0,
          };
        })
      );
  }

  private getLookupByHeaderId(headerId: string, errorContext: string): Observable<any> {
    return this.apiService
      .getSingle('AppLookups/headers/code', headerId)
      .pipe(
        map((response: any) => {
          if (!response?.success) {
            const msg =
              response?.errors?.join(', ') ||
              response?.message ||
              `Failed to load ${errorContext}`;

            throw new Error(msg);
          }
          return response.data.details;
        }),
      );
  }

  getCourseLevels(): Observable<any> {
    return this.getLookupByHeaderId(
      'COURSE_LEVEL',
      'course levels'
    );
  }

  getCourseCategories(): Observable<any> {
    return this.getLookupByHeaderId(
      'COURSE_CATEGORY',
      'course categories'
    );
  }

  getQuestionTypes(): Observable<any> {
    return this.getLookupByHeaderId(
      'QUESTION_TYPE',
      'question types'
    );
  }


}
