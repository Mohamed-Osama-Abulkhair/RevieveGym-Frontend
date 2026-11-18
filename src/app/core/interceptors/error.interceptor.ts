import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `خطأ في الاتصال: ${error.error.message}`;
      } else {
        if (error.status === 401) {
          const isAuthRoute = req.url.includes('/auth/login');
          if (!isAuthRoute) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            router.navigate(['/login']);
          }
        }

        if (error.error?.message) {
          errorMessage = error.error.message;
        }
      }

      console.error('API Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};
