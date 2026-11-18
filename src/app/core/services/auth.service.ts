import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IAuthResponse, IUser } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private baseUrl = `${environment.apiUrl}/auth`;
  private tokensUrl = `${environment.apiUrl}/tokens`;

  currentUser = signal<IUser | null>(this.getStoredUser());
  token = signal<string | null>(
    typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null
  );

  login(credentials: { identifier: string; password: string }): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap((res) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        this.token.set(res.accessToken);
        this.currentUser.set(res.user);
      })
    );
  }

  regenerateToken(token: string): Observable<{ message: string; accessToken: string }> {
    return this.http.post<{ message: string; accessToken: string }>(
      this.tokensUrl,
      { token }
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getRefreshToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  setAccessToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
    this.token.set(token);
  }

  private getStoredUser(): IUser | null {
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}
