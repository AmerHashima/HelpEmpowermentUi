// src\app\Services\student-exam.service.ts

import { computed, effect, inject, Injectable, signal, untracked } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { map, Observable } from 'rxjs';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { APIStudentExamResponse, choiceQuestionExamSubmit, matchingQuestionExamSubmit, startStudentExam, submitStudentExam } from '../models/certification';
import { RequestBody } from '../models/rquest';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentExamService {

  private auth = inject(AuthService);
  examIdsToDelete = this.auth.examIdsToDelete;
  reports = signal<APIStudentExamResponse[]>([]);

  successRate = computed(() => {
    const reports = this.reports();

    if (!reports.length) return 0;

    const total = reports.reduce((sum, r) => {
      if (!r.totalScore) return sum;
      return sum + (r.obtainedScore / r.totalScore) * 100;
    }, 0);

    return Math.round(total / reports.length);
  });
  constructor(private apiService: ApiService) {
    effect(() => {
      const studentId = this.auth.loggedStudent()?.userId;

      if (!studentId) return;
      this.loadReports(studentId);

    });

    effect(() => {
      const token = this.auth.studentToken();

      if (!token) {
        const ids = untracked(() => this.examIdsToDelete());

        if (!ids.length) return;

        ids.forEach(id => {
          this.deleteStudentExam(id).subscribe({
            error: err => console.error('Failed to delete exam', id, err)
          });
        });

        // clear ids so the effect won't repeat
        this.examIdsToDelete.set([]);
      }
    });

  }

  loadReports(studentId: string) {
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
          this.loadReports(this.auth.loggedStudent()?.userId!)
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
      .getSingle<ApiResponse<APIStudentExamResponse>>('StudentExams', id, 'studentExam')
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
