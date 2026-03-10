import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { APIAuthStudent, APIStudent, AuthStudent, Student } from '../models/student';
import { ApiResponse } from '../models/apiResponse';
import { map, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

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
  hasBought = signal<boolean>(true);
  loggedStudent=signal<APIAuthStudent | null>(null);
  studentToken=signal<string>('');
  adminToken = signal<string>('');
  constructor(private apiService: ApiService) {
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('loggedStudent');
      const studentToken = localStorage.getItem('studentToken');
      if (studentToken) {
        this.studentToken.set(studentToken);
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
            this.cleanupExamProgressNotSavedForLater();
          }
          return response.data;
        })
      );

  }

  cleanupExamProgressNotSavedForLater(): { removedCount: number; removedKeys: string[] } {
    if (!isPlatformBrowser(this.platformId)) {
      return { removedCount: 0, removedKeys: [] };
    }

    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.includes('exam-progress')) continue;

      const raw = localStorage.getItem(key);
      if (!raw) continue;
        const data = JSON.parse(raw);

        const shouldRemove = data?.saveForLater !== true;

        if (shouldRemove) {
          keysToRemove.push(key);
        }
     
    }

    // Perform removal
    keysToRemove.forEach(key => localStorage.removeItem(key));

    return {
      removedCount: keysToRemove.length,
      removedKeys: keysToRemove
    };
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

