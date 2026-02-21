import { HttpInterceptorFn } from '@angular/common/http';


export const studentAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('studentToken') : null;

  if (!token) {
    return next(req);
  }

  const clonedReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(clonedReq);
};
