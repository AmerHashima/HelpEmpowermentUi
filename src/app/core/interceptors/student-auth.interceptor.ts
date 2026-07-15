import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';


// export const studentAuthInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = typeof window !== 'undefined' ? localStorage.getItem('studentToken') : null;

//   if (!token) {
//     return next(req);
//   }

//   const clonedReq = req.clone({
//     setHeaders: { Authorization: `Bearer ${token}` }
//   });

//   return next(clonedReq);
// };


export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  if (typeof window === 'undefined') {

    return next(req);

  }

  const isAdmin = window.location.pathname.startsWith('/admin');

  const token = isAdmin

    ? localStorage.getItem('adminToken')

    : localStorage.getItem('studentToken');

  const request = req.clone({ setHeaders: {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }});

  return next(request).pipe(catchError(error => {
    if (error.status === 401 && !window.location.pathname.includes('/auth/login')) {
      const returnUrl = `${window.location.pathname}${window.location.search}`;
      const lang = window.location.pathname.startsWith('/ar/') ? 'ar' : 'en';
      void router.navigate([`/${lang}/auth/login`], { queryParams: { returnUrl } });
    }
    return throwError(() => error);
  }));

};

