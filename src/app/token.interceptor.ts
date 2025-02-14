import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs';
import { of } from 'rxjs';
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  const accessToken = sessionStorage.getItem('token');
  let modifiedReq = req;

  if (accessToken) {
    modifiedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(modifiedReq).pipe(
    catchError((error) => {
      if (error.status === 401 && error.error.message === 'Token expired') {
        return http.post('/refresh', {}).pipe(
          switchMap((refreshTokenResponse: any) => {
            sessionStorage.setItem('token', refreshTokenResponse.data.token);

            modifiedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${refreshTokenResponse.data.token}`,
              },
            });

            return next(modifiedReq);
          }),
          catchError((refreshError) => {
            router.navigate(['/login']);
            return of(refreshError);
          })
        );
      }
      return of(error);
    })
  );
};
