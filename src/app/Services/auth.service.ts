// src\app\Services\auth.service.ts
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import ApiService from '../shared/Services/ApiService/api.service';
import { APIAuthStudent, AuthStudent } from '../models/student';
import { ApiResponse } from '../models/apiResponse';
import { map, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface LoginForm {
  username: string,
  password: string
}

export interface changePasswordForm {
  oid: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  userId: string,
  updatedBy: string
}

export interface resetPasswordForm {
  email: string,
  token: string,
  newPassword: string,
  confirmPassword: string
}

export interface forgetPasswordForm {
  email: string,
  userType: string
}
export interface refreshTokenForm {
  token: string,
  refreshToken: string,
  tokenExpires?: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  loggedStudent = signal<APIAuthStudent | null>(null);
  studentToken = signal<string>('');
  adminToken = signal<string>('');
  examIdsToDelete = signal<string[]>([]);
  private refreshTimer: any;
  constructor(private apiService: ApiService) {
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('loggedStudent');
      const studentToken = localStorage.getItem('studentToken');
      if (studentToken) {
        this.studentToken.set(studentToken);
        this.startTokenRefreshTimer();
      }
      if (storedUser) {
        this.loggedStudent.set(JSON.parse(storedUser));
      }
    }
  }

  registerStudent(body: AuthStudent): Observable<APIAuthStudent> {
    return this.apiService
      .post<ApiResponse<APIAuthStudent>>('Auth/student/register', body, "auth.register.success")
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
      .post<ApiResponse<APIAuthStudent>>('Auth/student/login', body, "auth.loginToast.success")
      .pipe(
        map((response: ApiResponse<APIAuthStudent>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to login';
            throw new Error(msg);
          }
          this.updatedLoggedStudent(response.data);
          this.startTokenRefreshTimer();

          return response.data;
        })
      );
  }

  changeStudentPassword(body: changePasswordForm): Observable<boolean> {
    return this.apiService
      .post<ApiResponse<boolean>>('Auth/change-password', body, "auth.password.change.success")
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to change password';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  resetStudentPassword(body: resetPasswordForm): Observable<boolean> {
    return this.apiService
      .post<ApiResponse<boolean>>('Auth/reset-password', body, "auth.password.reset.success")
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to send mail';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  forgetStudentPassword(body: forgetPasswordForm): Observable<boolean> {
    return this.apiService
      .post<ApiResponse<boolean>>('Auth/forget-password', body, "auth.password.forget.success")
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to send mail';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  refreshToken(body: refreshTokenForm): Observable<refreshTokenForm> {
    return this.apiService
      .post<ApiResponse<refreshTokenForm>>('Auth/refresh-token', body, "")
      .pipe(
        map((response: ApiResponse<refreshTokenForm>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed refresh token';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }
  // logout(){
  //   return this.apiService
  //     .post<ApiResponse<boolean>>('Auth/logout', null, "User has been Logged out Successfully")
  //     .pipe(
  //       map((response: ApiResponse<boolean>) => {
  //         if (!response.success) {
  //           const msg = response.errors?.join(', ') || response.message || 'API failed logout';
  //           throw new Error(msg);
  //         }
  //         this.clearRefreshTimer();

  //         this.loggedStudent.set(null);
  //         this.studentToken.set('');
  //         if (this.isBrowser) {
  //           localStorage.removeItem('loggedStudent');
  //           localStorage.removeItem('studentToken');
  //           localStorage.removeItem('refreshToken');
  //           localStorage.removeItem('tokenExpires');
  //           this.cleanupExamProgressNotSavedForLater();
  //         }
  //         return response.data;
  //       })
  //     );

  // }

  // cleanupExamProgressNotSavedForLater(): { removedCount: number; removedKeys: string[] } {
  //   if (!isPlatformBrowser(this.platformId)) {
  //     return { removedCount: 0, removedKeys: [] };
  //   }

  //   const keysToRemove: string[] = [];

  //   for (let i = 0; i < localStorage.length; i++) {
  //     const key = localStorage.key(i);
  //     if (!key?.includes('exam-progress')) continue;

  //     const raw = localStorage.getItem(key);
  //     if (!raw) continue;
  //       const data = JSON.parse(raw);

  //       const shouldRemove = data?.saveForLater !== true;

  //       if (shouldRemove) {
  //         keysToRemove.push(key);
  //       }

  //   }

  //   // Perform removal
  //   keysToRemove.forEach(key => localStorage.removeItem(key));

  //   return {
  //     removedCount: keysToRemove.length,
  //     removedKeys: keysToRemove
  //   };
  // }

  logout() {
    return this.apiService
      .post<ApiResponse<boolean>>('Auth/logout', null, "auth.logoutToast.success")
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed logout';
            throw new Error(msg);
          }
          this.clearRefreshTimer();
          if (this.isBrowser) {
            localStorage.removeItem('loggedStudent');
            localStorage.removeItem('studentToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('tokenExpires');
            const data = this.cleanupExamProgressNotSavedForLater();
            this.examIdsToDelete.set(data.studentExamIds);
          }
          this.loggedStudent.set(null);
          this.studentToken.set('');

          return response.data;
        })
      );

  }
  cleanupExamProgressNotSavedForLater(): {
    removedCount: number;
    removedKeys: string[];
    studentExamIds: string[];
  } {

    if (!isPlatformBrowser(this.platformId)) {
      return { removedCount: 0, removedKeys: [], studentExamIds: [] };
    }

    const keysToRemove: string[] = [];
    const studentExamIds: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {

      const key = localStorage.key(i);
      if (!key?.includes('exam-progress')) continue;

      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const data = JSON.parse(raw);

        const shouldRemove = data?.saveForLater !== true;

        if (shouldRemove) {
          keysToRemove.push(key);

          if (data?.studentExamId) {
            studentExamIds.push(data.studentExamId);
          }
        }

      } catch {
        console.warn('Invalid exam progress entry', key);
      }
    }

    // remove storage entries
    keysToRemove.forEach(key => localStorage.removeItem(key));

    return {
      removedCount: keysToRemove.length,
      removedKeys: keysToRemove,
      studentExamIds
    };
  }


  private updatedLoggedStudent(data: APIAuthStudent) {
    this.loggedStudent.set(data);
    this.studentToken.set(data.token);

    if (this.isBrowser) {
      localStorage.setItem('loggedStudent', JSON.stringify(data));
      localStorage.setItem('studentToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('tokenExpires', data.tokenExpires);
    }
  }

  startTokenRefreshTimer() {
    if (!this.isBrowser) return;

    const expires = localStorage.getItem('tokenExpires');
    if (!expires) return;

    const expiresTime = new Date(expires).getTime();
    const now = Date.now();
    const refreshBefore = 30 * 1000;

    const delay = expiresTime - now - refreshBefore;

    this.refreshTimer = setTimeout(() => {
      this.refreshTokenRequest();
    }, delay);
  }

  private refreshTokenRequest() {
    const token = localStorage.getItem('studentToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!token || !refreshToken) return;

    this.refreshToken({ token, refreshToken }).subscribe({
      next: (data) => {
        this.studentToken.set(data.token);

        localStorage.setItem('studentToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('tokenExpires', data.tokenExpires ?? '');

        this.startTokenRefreshTimer();
      },
      error: () => {
        this.logout().subscribe();
      }
    });
  }

  private clearRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

