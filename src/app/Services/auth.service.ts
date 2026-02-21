import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { APIAuthStudent, APIStudent, AuthStudent, Student } from '../models/student';
import { ApiResponse } from '../models/apiResponse';
import { map, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface LoginForm{
  username: string,
  password: string
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  hasBought = signal<boolean>(false);
  loggedStudent=signal<APIAuthStudent | null>(null);
  studentToken=signal<string>('');
  adminToken = signal<string>('');
  constructor(private apiService: ApiService) {
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('loggedStudent');
      const studentToken = localStorage.getItem('studentToken');
      if (studentToken) {
        this.studentToken.set(JSON.parse(studentToken));
      }
      if (storedUser) {
        this.loggedStudent.set(JSON.parse(storedUser));
      }
    }
  }

  registerStudent(body: AuthStudent): Observable<APIAuthStudent> {
    return this.apiService
      .post<ApiResponse<APIAuthStudent>>('Auth/student/register', body,"User has been registerted Successfully")
      .pipe(
        map((response: ApiResponse<APIAuthStudent>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create student';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  loginStudent(body: LoginForm): Observable<APIAuthStudent> {
    return this.apiService
      .post<ApiResponse<APIAuthStudent>>('Auth/student/login', body,"User has been logged successfully")
      .pipe(
        map((response: ApiResponse<APIAuthStudent>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to login';
            throw new Error(msg);
          }
          this.updatedLoggedStudent(response.data);

          return response.data;
        })
      );
  }

  logout(){
    console.log('in service click logout');

    return this.apiService
      .post<ApiResponse<boolean>>('Auth/logout', null, "User has been Logged out Successfully")
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed logout';
            throw new Error(msg);
          }
          this.loggedStudent.set(null);
          this.studentToken.set('');
          if (this.isBrowser) {
            localStorage.removeItem('loggedStudent');
            localStorage.removeItem('studentToken');

          }
          return response.data;
        })
      );

  }


  private updatedLoggedStudent(data: APIAuthStudent) {
    this.loggedStudent.set(data);
    this.studentToken.set(data.token);

    if (this.isBrowser) {
      localStorage.setItem('loggedStudent', JSON.stringify(data));
      localStorage.setItem('studentToken', data.token);

    }
  }
}

