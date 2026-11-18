import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

export interface CacheEntry {
  response: HttpResponse<any>;
  cachedAt: number;
  ttl: number; // in milliseconds
  tag: string;
}

/**
 * ⚡ Senior-Grade In-Memory HTTP Cache Service (Redis-like store for Angular).
 * - Stores API GET responses in memory (RAM) with configurable Time-To-Live (TTL).
 * - Instant 0ms response for cached entries, completely eliminating redundant network calls.
 * - Supports targeted tag-based cache invalidation (e.g. invalidate 'plans' upon creation/edit).
 */
@Injectable({
  providedIn: 'root',
})
export class HttpCacheService {
  private cache = new Map<string, CacheEntry>();

  /**
   * Retrieves a cached response if present and not expired.
   * If expired, removes it from memory and returns null.
   */
  get(key: string): HttpResponse<any> | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.cachedAt > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.response.clone();
  }

  /**
   * Stores a response in the in-memory cache with specified TTL and tag.
   */
  set(
    key: string,
    response: HttpResponse<any>,
    ttl: number = 5 * 60 * 1000,
    tag: string = 'general'
  ): void {
    this.cache.set(key, {
      response: response.clone(),
      cachedAt: Date.now(),
      ttl,
      tag,
    });
  }

  /**
   * Invalidates all cache entries associated with a specific tag (e.g. 'plans', 'members').
   */
  invalidateTag(tag: string): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tag === tag) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Invalidates cache entries matching a string substring or RegExp pattern.
   */
  invalidateMatching(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clears the entire in-memory cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Returns current cache statistics for monitoring and debugging.
   */
  getStats(): { count: number; keys: string[] } {
    return {
      count: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
