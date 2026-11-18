import {
  HttpContextToken,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpCacheService } from '../services/http-cache.service';

export const BYPASS_CACHE = new HttpContextToken<boolean>(() => false);
export const CACHE_TTL = new HttpContextToken<number | null>(() => null);
export const CACHE_TAG = new HttpContextToken<string | null>(() => null);

const EXCLUDED_PATHS: string[] = [
  '/auth/',
  '/login',
  '/logout',
  '/tokens',
  '/users/profile',
];

export const cacheInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const cacheService = inject(HttpCacheService);

  // 1. Non-GET requests (mutations): bypass cache and invalidate affected resources upon success
  if (req.method !== 'GET') {
    return next(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && event.status >= 200 && event.status < 300) {
          handleMutationInvalidation(req.url, cacheService);
        }
      })
    );
  }

  // 2. Check if this request should bypass caching
  const isBypassed =
    req.context.get(BYPASS_CACHE) ||
    EXCLUDED_PATHS.some((path) => req.url.toLowerCase().includes(path));

  if (isBypassed) {
    return next(req);
  }

  // 3. Check for existing valid cache entry
  const cacheKey = req.urlWithParams;
  const cachedResponse = cacheService.get(cacheKey);

  if (cachedResponse) {
    return of(cachedResponse);
  }

  // 4. Cache Miss: Execute request and store response in cache
  const { ttl, tag } = resolveCachePolicy(req);

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.status === 200) {
        cacheService.set(cacheKey, event, ttl, tag);
      }
    })
  );
};

function resolveCachePolicy(req: HttpRequest<unknown>): { ttl: number; tag: string } {
  const customTtl = req.context.get(CACHE_TTL);
  const customTag = req.context.get(CACHE_TAG);
  const url = req.url.toLowerCase();

  if (customTag) {
    return {
      ttl: customTtl || 5 * 60 * 1000,
      tag: customTag,
    };
  }

  // Plans, packages: rarely change -> 15 minutes
  if (url.includes('/plans')) {
    return {
      ttl: customTtl || 15 * 60 * 1000,
      tag: 'plans',
    };
  }

  // Members list & details -> 5 minutes
  if (url.includes('/users')) {
    return {
      ttl: customTtl || 5 * 60 * 1000,
      tag: 'users',
    };
  }

  // Subscriptions & Attendance -> 3 minutes
  if (url.includes('/subscriptions') || url.includes('/attendances')) {
    return {
      ttl: customTtl || 3 * 60 * 1000,
      tag: 'subscriptions',
    };
  }

  // Default fallback -> 3 minutes
  return {
    ttl: customTtl || 3 * 60 * 1000,
    tag: 'general',
  };
}

function handleMutationInvalidation(url: string, cacheService: HttpCacheService): void {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('/plans')) {
    cacheService.invalidateTag('plans');
  }
  if (lowerUrl.includes('/users')) {
    cacheService.invalidateTag('users');
  }
  if (lowerUrl.includes('/subscriptions')) {
    cacheService.invalidateTag('subscriptions');
    cacheService.invalidateTag('users');
  }
  if (lowerUrl.includes('/attendances')) {
    cacheService.invalidateTag('subscriptions');
  }
}
