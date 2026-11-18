import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const token =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null;
  const isTokenRefreshReq = req.url.includes('/tokens');
  const isPublicAuthRoute =
    req.url.includes('/auth/login') || req.url.includes('/auth/register');

  let authReq = req;
  if (token && !isTokenRefreshReq && !isPublicAuthRoute) {
    authReq = addTokenHeader(req, token);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthError = error.status === 401 || error.status === 403;
      const isRetried = req.headers.has('X-Auth-Retry');

      if (isAuthError && !isPublicAuthRoute && !isRetried) {
        const authService = injector.get(AuthService);
        return handleAuthError(req, next, authService, error);
      }
      return throwError(() => error);
    })
  );
};

function addTokenHeader(
  request: HttpRequest<unknown>,
  token: string,
  isRetry: boolean = false
): HttpRequest<unknown> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (isRetry) {
    headers['X-Auth-Retry'] = 'true';
  }

  return request.clone({
    setHeaders: headers,
  });
}

function handleAuthError(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  originalError: HttpErrorResponse
) {
  const storedRefreshToken = authService.getRefreshToken();

  if (!storedRefreshToken) {
    authService.logout();
    return throwError(() => originalError);
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.regenerateToken(storedRefreshToken).pipe(
      switchMap((res: any) => {
        isRefreshing = false;
        const newAccessToken = res.accessToken;
        authService.setAccessToken(newAccessToken);
        refreshTokenSubject.next(newAccessToken);
        return next(addTokenHeader(req, newAccessToken, true));
      }),
      catchError((refreshErr) => {
        isRefreshing = false;
        refreshTokenSubject.next(null);
        authService.logout();
        return throwError(() => refreshErr);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((t) => t !== null),
      take(1),
      switchMap((token) => next(addTokenHeader(req, token!, true)))
    );
  }
}
