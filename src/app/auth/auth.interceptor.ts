import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  let authReq = req;
  const isS3Request = req.url.includes(
    'amit-community.s3.ap-south-1.amazonaws.com'
  );
  console.log(isS3Request, req.url);
  if (token && !isS3Request) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Token is invalid, logout and redirect
        authService.logoutAndRedirect();
      }
      return throwError(() => error); // Re-throw error for components to handle
    })
  );
};
