import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  const tenant = window.location.hostname.split('.')[0];

  return next(
    req.clone({
      setHeaders: {
        'X-Subdomain': tenant,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  );
};
