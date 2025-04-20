import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenStorageService);
  const router = inject(Router);
  const token = tokenService.getToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(authReq).pipe(
    tap({
      next: () => {},
      error: (error) => {
        if (
          error instanceof HttpErrorResponse &&
          (error.status === 401 || error.status === 403)
        ) {
          console.error(
            'Unauthorized or Forbidden request. Redirecting to login.',
            error
          );
          router.navigate(['/login']);
        }
        throw error;
      },
    })
  );
};
