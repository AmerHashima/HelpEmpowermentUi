import { HttpInterceptorFn } from '@angular/common/http';


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

  if (typeof window === 'undefined') {

    return next(req);

  }

  const isAdmin = window.location.pathname.startsWith('/admin');

  const token = isAdmin

    ? localStorage.getItem('adminToken')

    : localStorage.getItem('studentToken');

  if (!token) {

    return next(req);

  }

  return next(

    req.clone({

      setHeaders: {

        Authorization: `Bearer ${token}`

      }

    })

  );

};

