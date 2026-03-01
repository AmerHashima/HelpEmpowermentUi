// src\app\Services\student-service.service.ts
import { Injectable } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { map, Observable } from 'rxjs';
import { APIStudent, Student } from '../models/student';
import { ApiResponse, ApiSearchResponse } from '../models/apiResponse';
import { APIStudentExamResponse, startStudentExam } from '../models/certification';
import { RequestBody } from '../models/rquest';
import { APIStudentCourse } from '../models/student-course';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private apiService: ApiService) { }

  searchStudents(body: RequestBody): Observable<{ students: APIStudent[]; total: number }> {
    return this.apiService
      .query<ApiSearchResponse<APIStudent>>('Students/with-courses', body)
      .pipe(
        map((response: ApiSearchResponse<APIStudent>) => {
          if (!response.success) {
            const msg = response.message || 'API failed to query students';
            throw new Error(msg);
          }
          return {
            students: response.data ?? [],
            total: response.totalCount ?? 0,
          };
        })
      );
  }

  getStudents(): Observable<APIStudent[]> {
    return this.apiService.get<ApiResponse<APIStudent[]>>('Students').pipe(
      map((response: ApiResponse<APIStudent[]>) => {
        if (!response.success) {
          throw new Error(response.message || 'API failed to load students');
        }
        return response.data;
      })
    );
  }

  createStudent(body: Student): Observable<APIStudent> {
    return this.apiService
      .post<ApiResponse<APIStudent>>('Students', body, "Student has been registerted Successfully")
      .pipe(
        map((response: ApiResponse<APIStudent>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create student';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  updateStudent(id: string, body: Student): Observable<APIStudent> {
    const updateBody: Student = {
      ...body,
      oid: id,
    };

    return this.apiService
      .put<ApiResponse<APIStudent>>('Students', id, updateBody, 'User info has been updated successfully')
      .pipe(
        map((response: ApiResponse<APIStudent>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update student';
            throw new Error(msg);
          }
          // this.updatedLoggedStudent(response.data);
          return response.data;
        })
      );
  }

  deleteStudent(id: string): Observable<boolean> {
    return this.apiService
      .delete<ApiResponse<boolean>>('Students', id)
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

  getStudent(id: string): Observable<APIStudent> {
    return this.apiService
      .getSingle<ApiResponse<APIStudent>>('Students', id)
      .pipe(
        map((response: ApiResponse<APIStudent>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load student';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  getStudentReservedCourses(studentId: string): Observable<APIStudentCourse[]> {
    return this.apiService
      .get<ApiResponse<APIStudentCourse[]>>(`StudentCourses/student/${studentId}`)
      .pipe(
        map((response: ApiResponse<APIStudentCourse[]>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to load student courses';
            throw new Error(msg);
          }
          return response.data ?? [];
        })
      );
  }

  startExam(body: startStudentExam): Observable<APIStudentExamResponse> {
    return this.apiService
      .post<ApiResponse<APIStudentExamResponse>>('StudnetExams/start', body, "Exam has been started!")
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

}
