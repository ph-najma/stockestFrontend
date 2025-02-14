import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AlertService } from './services/alert.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const alertService = inject(AlertService);

  return next(req).pipe(
    tap({
      error: (error: HttpErrorResponse) => {
        console.log('HTTP Error:', error);

        if (error.status === 403) {
          console.log('User account is blocked, redirecting to login...');
          alertService.showAlert(
            'You have been logged out because your account was blocked.'
          );
          sessionStorage.removeItem('token');
          router.navigate(['/login']);
        }
      },
    })
  );
};
