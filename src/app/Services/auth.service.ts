import { Injectable, signal } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { APIStudent, Student } from '../models/student';
import { ApiResponse } from '../models/apiResponse';
import { map, Observable } from 'rxjs';

interface LoginForm{
  username: string,
  password: string
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  hasBought = signal<boolean>(false);
  loggedStudent=signal<APIStudent | null>(null);
  constructor(private apiService: ApiService) { }

  registerStudent(body: Student): Observable<APIStudent> {
    return this.apiService
      .post<ApiResponse<APIStudent>>('Students', body,"User has been registerted Successfully")
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

  loginStudent(body: LoginForm): Observable<APIStudent> {
    return this.apiService
      .post<ApiResponse<APIStudent>>('Students/authenticate', body,"User has been logged successfully")
      .pipe(
        map((response: ApiResponse<APIStudent>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to login';
            throw new Error(msg);
          }
          this.loggedStudent.set(response.data);
          return response.data;
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


  updateStudent(id: string, body: Student): Observable<APIStudent> {
    return this.apiService
      .put<ApiResponse<APIStudent>>('Courses', id, body)
      .pipe(
        map((response: ApiResponse<APIStudent>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to update student';
            throw new Error(msg);
          }

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
}

