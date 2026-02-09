// src\app\Services\certification.service.ts
import { Injectable } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { APICertification, APICourseQuestion, APIExam, Certification, courseExam } from '../models/certification';
import { RequestBody } from '../models/rquest';
import { AnyAaaaRecord } from 'dns';

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

  getByCourse<T>(endpoint: string, courseId: string): Observable<T[]> {
    return this.apiService
      .getSingle<ApiResponse<T[]>>(`${endpoint}/course`, courseId)
      .pipe(
        map((response: ApiResponse<T[]>) => {
          if (!response.success) {
            const msg =
              response.errors?.join(', ') || response.message || 'API call failed';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  getCertificationExams(id: string): Observable<any[]> {
    return this.getByCourse<any>('CoursesMasterExams', id);
  }

  // For features
  getCertificationFeatures(id: string): Observable<any[]> {
    return this.getByCourse<any>('CourseFeatures', id);
  }


  updateCertification(id: string, body: Certification): Observable<APICertification> {
    return this.apiService
      .put<ApiResponse<APICertification>>('Courses', id, body)
      .pipe(
        map((response: ApiResponse<APICertification>) => {
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

  //content
  getCertificationContents(id: string): Observable<any[]> {
    console.log('writie api cal')
    return of([null]);
  }

  createCourseContent(body: any): Observable<any> {
    return this.apiService
      .post<ApiResponse<any>>('CourseContents', body)
      .pipe(
        map((response: ApiResponse<any>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create course content';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  updateCourseContent(id: string, body: any): Observable<any> {
    return this.apiService
      .put<ApiResponse<any>>('CourseContents', id, body)
      .pipe(
        map((response: ApiResponse<any>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update course content';
            throw new Error(msg);
          }

          return response.data;
        })
      );
  }

  deleteCourseContent(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('CourseContents', id)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete content';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  // outlines

  getCertificationOutlines(id: string): Observable<any[]> {
    return this.getByCourse<any>('CourseOutlines', id);

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

  getExamModes(): Observable<any> {
    return this.getLookupByHeaderId(
      'Exam_Modes',
      'exam modes'
    );
  }

  createQuestion(body: any): Observable<any> {
    return this.apiService
      .post<ApiResponse<any>>('CourseQuestions', body)
      .pipe(
        map((response: ApiResponse<any>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create certification';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  // updateQuestion(id: string, body: any): Observable<any> {
  //   return this.apiService
  //     .put<ApiResponse<any>>('CourseQuestions', id, body)
  //     .pipe(
  //       map((response: ApiResponse<APICertification>) => {
  //         if (!response.success) {
  //           const msg = response.errors?.join(', ') || response.message || 'API failed to update certification';
  //           throw new Error(msg);
  //         }

  //         return response.data;
  //       })
  //     );
  // }
  updateQuestion(id: string, body: any): Observable<any> {
    return this.apiService
      .put<ApiResponse<any>>('CourseAnswers', id, body)
      .pipe(
        map((response: ApiResponse<APICertification>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update certification';
            throw new Error(msg);
          }

          return response.data;
        })
      );
  }
  searchQuestion(body: RequestBody): Observable<{ questions: APICourseQuestion[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APICourseQuestion>>('CourseQuestions/search', body)
      .pipe(
        map((response: ApiSearchResponse<APICourseQuestion>) => {
          if (!response.success) {
            const msg = response.message || 'API failed to query';
            throw new Error(msg);
          }
          return {
            questions: response.data ?? [],
            total: response.totalPages ?? 0,
          };
        })
      );
  }

  getQuestion(id: string): Observable<APICourseQuestion> {
    return this.apiService
      // .getSingle<ApiResponse<APICourseQuestion>>('CourseQuestions', id)
      .getSingle<ApiResponse<APICourseQuestion>>('CourseQuestions', id, 'question')
      .pipe(
        map((response: ApiResponse<APICourseQuestion>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load QUESTIONS';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  deleteQuestion(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('CourseQuestions', id)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete question';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  deleteAnswer(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('CourseAnswers', id)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete answer';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  createAnswer(body: any): Observable<any> {
    return this.apiService
      .post<ApiResponse<any>>('CourseAnswers', body)
      .pipe(
        map((response: ApiResponse<any>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create answer';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  createCourseFeature(body: any): Observable<any> {
    return this.apiService
      .post<ApiResponse<any>>('CourseFeatures', body)
      .pipe(
        map((response: ApiResponse<any>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create certification';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  updateCourseFeature(id: string, body: any): Observable<any> {
    return this.apiService
      .put<ApiResponse<any>>('CourseFeatures', id, body)
      .pipe(
        map((response: ApiResponse<APICertification>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update certification';
            throw new Error(msg);
          }

          return response.data;
        })
      );
  }
  deleteCourseFeature(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('CourseFeatures', id)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete feature';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }


}
