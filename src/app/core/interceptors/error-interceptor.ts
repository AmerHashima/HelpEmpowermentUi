// error.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import ApiStatusService from '../../shared/Services/ApiService/api-status.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const apiStatus = inject(ApiStatusService);

  const isApiCall = req.url.includes('/api');

  return next(req).pipe(
    tap({
      next: () => {
        // ✅ Recover only if server was down
        if (isApiCall && apiStatus.isServerDown()) {
          apiStatus.setUp();
        }
      }
    }),
    catchError((error) => {
      if (
        isApiCall &&
        (error.status === 0 || error.status >= 500)
      ) {
        // ✅ setDown only once
        apiStatus.setDown();
      }

      return throwError(() => error);
    })
  );
};
