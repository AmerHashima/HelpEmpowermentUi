import { effect, inject, Injectable, signal } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { map, Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { APIStudentExamResponse, choiceQuestionExamSubmit, matchingQuestionExamSubmit, startStudentExam, submitStudentExam } from '../models/certification';
import { RequestBody } from '../models/rquest';
import { AuthService } from './auth.service';
import { Shared } from '../shared/Services/shared/shared';

@Injectable({
  providedIn: 'root'
})
export class StudentExamService {

  private auth = inject(AuthService);
  reports = signal<APIStudentExamResponse[]>([]);

  constructor(private apiService: ApiService) {
    effect(() => {
      const studentId = this.auth.loggedStudent()?.userId;

      if (!studentId) return;

      this.getStudentExamsByStudentId(studentId)
        .subscribe(r => this.reports.set(r));
    });
 
  }

  loadStudentReports(studentId: string) {
    this.getStudentExamsByStudentId(studentId)
      .subscribe(r => this.reports.set(r));
  }

  startExam(body: startStudentExam): Observable<APIStudentExamResponse> {
    return this.apiService
      .post<ApiResponse<APIStudentExamResponse>>('StudentExams/start', body, "Exam has been started!")
      .pipe(
        map((response: ApiResponse<APIStudentExamResponse>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to start exam';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  submitExam(body: submitStudentExam): Observable<APIStudentExamResponse> {
    return this.apiService
      .post<ApiResponse<APIStudentExamResponse>>('StudentExams/submit', body, "Exam has been submitted successfully!")
      .pipe(
        map((response: ApiResponse<APIStudentExamResponse>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to submit exam';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  getStudentExam(id: string): Observable<APIStudentExamResponse> {
        return this.apiService
          .getSingle<ApiResponse<APIStudentExamResponse>>('StudentExams', id)
          .pipe(
            map((response: ApiResponse<APIStudentExamResponse>) => {
              if (!response.success) {
                const msg = response.errors?.join(', ') || response.message || 'API failed to load student exam';
                throw new Error(msg);
              }
              return response.data;
            })
          );
      }

  getStudentExamWithQuestions(id: string): Observable<APIStudentExamResponse> {
    return this.apiService
      .getSingle<ApiResponse<APIStudentExamResponse>>('StudentExams', id,'studentExam')
      .pipe(
        map((response: ApiResponse<APIStudentExamResponse>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load student exam';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  getStudentExamsByStudentId(id: string): Observable<APIStudentExamResponse[]> {
    return this.apiService
      .getSingle<ApiResponse<APIStudentExamResponse[]>>('StudentExams/student', id)
      .pipe(
        map((response: ApiResponse<APIStudentExamResponse[]>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load student exam';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  deleteStudentExam(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('StudentExams', id)
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to delete student';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  searchStudentExam(body: RequestBody): Observable<{ studenExams: APIStudentExamResponse[]; total: number }> {
      return this.apiService
        .query<ApiSearchResponse<APIStudentExamResponse>>('StudentExams/search', body)
        .pipe(
          map((response: ApiSearchResponse<APIStudentExamResponse>) => {
            if (!response.success) {
              const msg = response.message || 'API failed to query';
              throw new Error(msg);
            }
            return {
              studenExams: response.data ?? [],
              total: response.totalPages ?? 0,
            };
          })
        );
    }

  submitchoiceExamQuestion(body: choiceQuestionExamSubmit): Observable<string> {
    return this.apiService
      .post<ApiResponse<string>>('StudentExamQuestions/submit-multiple', body)
      .pipe(
        map((response: ApiResponse<string>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to start exam';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }


  submitMatchingExamQuestion(body: matchingQuestionExamSubmit): Observable<string> {
    return this.apiService
      .post<ApiResponse<string>>('StudentExamQuestions/validate-answers', body)
      .pipe(
        map((response: ApiResponse<string>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to start exam';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }



}
