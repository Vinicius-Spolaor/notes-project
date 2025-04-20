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
        if (error instanceof HttpErrorResponse)
          if (error.status === 401 || error.status === 403) {
            const message = 'Unauthorized or Forbidden request. Redirecting to login.';
            window.alert(message);
            console.error(message, error);
            router.navigate(['/login']);
            throw error;
          } else if (error.status === 0 && error.statusText === 'Unknown Error') {
            const message = 'Could not connect to the server. Please check your network connection and ensure the backend is running.';
            window.alert(message);
            console.error(message, error);
            router.navigate(['/login']);
            throw error;
          }
        throw error;
      },
    })
  );
};
