import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  const send = (token: string | null, isRetry = false) => {
    const headers: Record<string, string> = {
      'X-Subdomain': window.location.hostname.split('.')[0],
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (isRetry) headers['X-Retry'] = '1';
    return next(req.clone({ setHeaders: headers }));
  };

  return send(localStorage.getItem('access_token')).pipe(
    catchError((error: HttpErrorResponse) => {
      const alreadyRetried = req.headers.has('X-Retry');
      if (error.status !== 401 || alreadyRetried || req.url.includes('/auth/')) {
        return throwError(() => error);
      }
      return auth.refreshSession().pipe(
        switchMap((ok) =>
          ok
            ? send(localStorage.getItem('access_token'), true)
            : throwError(() => error)
        )
      );
    })
  );
};
