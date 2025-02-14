import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const nonauthenticatedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');
  if (token) {
    router.navigate(['/home']);
    return false;
  }
  return true;
};
