import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, Subscription } from 'rxjs';
import ApiService from '../shared/Services/ApiService/api.service';
import { APIAuthStudent, AuthStudent } from '../models/student';
import { ApiResponse } from '../models/apiResponse';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

interface LoginForm {
  username: string;
  password: string;
}

export interface refreshTokenForm {
  token: string;
  refreshToken: string;
  tokenExpires?: string;
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
  resetToken: string,
  newPassword: string,
  confirmPassword: string
}

export interface forgetPasswordForm {
  email: string,
  userType: string
}

export interface StudentLogoutPayload {

  deviceId: string;

}

type Role = 'student' | 'admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // ================= SIGNALS =================
  loggedStudent = signal<APIAuthStudent | null>(null);
  studentToken = signal<string>('');

  loggedAdmin = signal<APIAuthStudent | null>(null);
  adminToken = signal<string>('');

  // ================= INTERNAL =================
  private refreshTimer: any;
  private adminRefreshTimer: any;

  private refreshSub?: Subscription;
  private adminRefreshSub?: Subscription;

  private isLoggingOutStudent = false;
  private isLoggingOutAdmin = false;
  examIdsToDelete = signal<string[]>([]);
  constructor(private apiService: ApiService) {
    if (this.isBrowser) {
      this.restoreSession();
    }
  }

  // ================= RESTORE =================
  private restoreSession() {
    try {
      this.restoreStudent();
      this.restoreAdmin();
    } catch {
      // Safari can deny localStorage in private/restricted browsing. Treat that
      // as a signed-out session instead of aborting the entire app bootstrap.
      this.loggedStudent.set(null);
      this.studentToken.set('');
      this.loggedAdmin.set(null);
      this.adminToken.set('');
    }
  }

  private restoreStudent() {
    const user = localStorage.getItem('loggedStudent');
    const token = localStorage.getItem('studentToken');

    if (user) this.loggedStudent.set(JSON.parse(user));
    if (token) {
      this.studentToken.set(token);
      this.startRefreshTimer('student');
    }
  }

  private restoreAdmin() {
    const user = localStorage.getItem('loggedAdmin');
    const token = localStorage.getItem('adminToken');

    if (user) this.loggedAdmin.set(JSON.parse(user));
    if (token) {
      this.adminToken.set(token);
      this.startRefreshTimer('admin');
    }
  }

  // ================= LOGIN =================
  loginStudent(body: LoginForm): Observable<APIAuthStudent> {
    return this.apiService
      .post<ApiResponse<APIAuthStudent>>('Auth/student/login', body, "auth.loginToast.success")
      .pipe(
        map(res => {
          if (!res.success) throw new Error(res.message);
          this.setStudentSession(res.data);
          return res.data;
        })
      );
  }




  loginAdmin(body: LoginForm): Observable<APIAuthStudent> {
    return this.apiService
      .post<ApiResponse<APIAuthStudent>>('Auth/user/login', body, "auth.loginToast.success")
      .pipe(
        map(res => {
          if (!res.success) throw new Error(res.message);
          this.setAdminSession(res.data);
          return res.data;
        })
      );
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

  registerUser(body: any): Observable<APIAuthStudent> {
    return this.apiService
      .post<ApiResponse<APIAuthStudent>>('Auth/user/register', body, "auth.register.success")
      .pipe(
        map((response: ApiResponse<APIAuthStudent>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to create user';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  // ================= SESSION SET =================
  private setStudentSession(data: APIAuthStudent) {
    this.isLoggingOutStudent = false;

    this.loggedStudent.set(data);
    this.studentToken.set(data.token);

    localStorage.setItem('loggedStudent', JSON.stringify(data));
    localStorage.setItem('studentToken', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('tokenExpires', data.tokenExpires);

    this.startRefreshTimer('student');
  }

  private setAdminSession(data: APIAuthStudent) {
    this.isLoggingOutAdmin = false;

    this.loggedAdmin.set(data);
    this.adminToken.set(data.token);

    localStorage.setItem('loggedAdmin', JSON.stringify(data));
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminRefreshToken', data.refreshToken);
    localStorage.setItem('adminTokenExpires', data.tokenExpires);

    this.startRefreshTimer('admin');
  }

  // ================= LOGOUT =================
  // logout(role: Role = 'student'): Observable<ApiResponse<boolean>> {
  //   return this.apiService.post<ApiResponse<boolean>>(
  //     'Auth/logout',
  //     null,
  //     "auth.logoutToast.success"
  //   ).pipe(
  //     map(res => {
  //       if (!res.success) throw new Error(res.message);

  //       if (role === 'student') this.clearStudentSession();
  //       else this.clearAdminSession();

  //       return res;
  //     })
  //   );
  // }

  logout(role: Role = 'student'): Observable<ApiResponse<boolean>> {
    return new Observable(observer => {
      (async () => {
        try {
          const baseUrl =
            role === 'student'
              ? 'Auth/student/logout'
              : 'Auth/user/logout';

          const body =
            role === 'student'
              ? { deviceId: await this.getDeviceId() }
              : null;

          this.apiService
            .post<ApiResponse<boolean>>(
              baseUrl,
              body,
              'auth.logoutToast.success'
            )
            .subscribe({
              next: res => {
                if (!res.success) {
                  observer.error(new Error(res.message));
                  return;
                }

                if (role === 'student') {
                  this.clearStudentSession();
                } else {
                  this.clearAdminSession();
                }

                observer.next(res);
                observer.complete();
              },
              error: err => observer.error(err)
            });
        } catch (err) {
          observer.error(err);
        }
      })();
    });
  }

  // logout(role: Role = 'student'): Observable<ApiResponse<boolean>> {
  //   const baseUrl= role =='student' ? 'Auth/student/logout' : 'Auth/user/logout';
  //   return this.apiService.post<ApiResponse<boolean>>(
  //     baseUrl,
  //     null,
  //     "auth.logoutToast.success"
  //   ).pipe(
  //     map(res => {
  //       if (!res.success) throw new Error(res.message);

  //       if (role === 'student') this.clearStudentSession();
  //       else this.clearAdminSession();

  //       return res;
  //     })
  //   );
  // }

  updatedLoggedStudent(data: APIAuthStudent) {
    this.setStudentSession(data);
  }

  private clearStudentSession() {
    this.isLoggingOutStudent = true;

    this.clearTimer('student');
    this.refreshSub?.unsubscribe();

    const data = this.cleanupExamProgressNotSavedForLater();
    this.examIdsToDelete.set(data.studentExamIds);

    localStorage.removeItem('loggedStudent');
    localStorage.removeItem('studentToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpires');

    this.loggedStudent.set(null);
    this.studentToken.set('');
  }

  private clearAdminSession() {
    this.isLoggingOutAdmin = true;

    this.clearTimer('admin');
    this.adminRefreshSub?.unsubscribe();

    localStorage.removeItem('loggedAdmin');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminTokenExpires');

    this.loggedAdmin.set(null);
    this.adminToken.set('');
  }

  // ================= REFRESH =================
  private startRefreshTimer(role: Role) {
    const key = role === 'student' ? 'tokenExpires' : 'adminTokenExpires';
    const expires = localStorage.getItem(key);
    if (!expires) return;

    const expiresTime = new Date(expires).getTime();
    const now = Date.now();
    const delay = Math.max(expiresTime - now - 30000, 1000);

    this.clearTimer(role);

    if (role === 'student') {
      this.refreshTimer = setTimeout(() => this.refreshStudent(), delay);
    } else {
      this.adminRefreshTimer = setTimeout(() => this.refreshAdmin(), delay);
    }
  }

  private refreshStudent() {
    if (this.isLoggingOutStudent) return;

    const token = localStorage.getItem('studentToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!token || !refreshToken) return;

    this.refreshSub = this.refreshToken({ token, refreshToken }).subscribe({
      next: data => {
        if (this.isLoggingOutStudent) return;

        this.studentToken.set(data.token);

        localStorage.setItem('studentToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('tokenExpires', data.tokenExpires ?? '');

        this.startRefreshTimer('student');
      },
      error: () => this.clearStudentSession()
    });
  }

  private refreshAdmin() {
    if (this.isLoggingOutAdmin) return;

    const token = localStorage.getItem('adminToken');
    const refreshToken = localStorage.getItem('adminRefreshToken');
    if (!token || !refreshToken) return;

    this.adminRefreshSub = this.refreshToken({ token, refreshToken }).subscribe({
      next: data => {
        if (this.isLoggingOutAdmin) return;

        this.adminToken.set(data.token);

        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminRefreshToken', data.refreshToken);
        localStorage.setItem('adminTokenExpires', data.tokenExpires ?? '');

        this.startRefreshTimer('admin');
      },
      error: () => this.clearAdminSession()
    });
  }

  refreshToken(body: refreshTokenForm): Observable<refreshTokenForm> {
    return this.apiService
      .post<ApiResponse<refreshTokenForm>>('Auth/refresh-token', body, "")
      .pipe(
        map(res => {
          if (!res.success) throw new Error(res.message);
          return res.data;
        })
      );
  }

  // ================= TIMER =================
  private clearTimer(role: Role) {
    if (role === 'student' && this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    if (role === 'admin' && this.adminRefreshTimer) {
      clearTimeout(this.adminRefreshTimer);
      this.adminRefreshTimer = null;
    }
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
        .post<ApiResponse<boolean>>('Auth/otp/reset-password', body, "auth.password.reset.success")
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


  verifyOtp(body: { email: string, otpCode: string, userType: string }): Observable<{ email: string, resetToken: string, userType: string }> {
    return this.apiService
      .post<ApiResponse<{ email: string, resetToken: string, userType: string }>>('Auth/otp/verify', body, "auth.otp.verify.success")
      .pipe(
        map((response: ApiResponse<{ email: string, resetToken: string, userType: string }>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to verify OTP';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  sendOtp(body: { email: string, userType: string }): Observable<boolean> {
    return this.apiService
      .post<ApiResponse<boolean>>('Auth/otp/send', body, "auth.otp.send.success")
      .pipe(
        map((response: ApiResponse<boolean>) => {
          if (!response.success) {
            const msg = response.errors?.join(', ') || response.message || 'API failed to send OTP';
            throw new Error(msg);
          }
          return response.data;
        })
      );
  }

  cleanupExamProgressNotSavedForLater(): {
    removedCount: number;
    removedKeys: string[];
    studentExamIds: string[];
  } {
    if (!this.isBrowser) {
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
        if (data?.saveForLater !== true) {
          keysToRemove.push(key);
          if (data?.studentExamId) {
            studentExamIds.push(data.studentExamId);
          }
        }
      } catch { }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));

    return {
      removedCount: keysToRemove.length,
      removedKeys: keysToRemove,
      studentExamIds
    };
  }

   async getDeviceId(): Promise<string> {

    if (!isPlatformBrowser(this.platformId)) {

      return '';

    }

    const storageKey = 'deviceId';

    const existingDeviceId = localStorage.getItem(storageKey);

    if (existingDeviceId) {

      return existingDeviceId;

    }

    const fp = await FingerprintJS.load();

    const result = await fp.get();

    const deviceId = result.visitorId;

    localStorage.setItem(storageKey, deviceId);

    return deviceId;

  }
}
