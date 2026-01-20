import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, throwError, catchError, switchMap } from 'rxjs';
import { UserProfile } from '../../models/Domains/UserProfile';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, TokenResponse } from '../../models/Domains/auth.types';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private currentUserSubject = new BehaviorSubject<UserProfile | null | undefined>(undefined);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadInitialUser();
  }

  private fetchUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`).pipe(
      tap(user => {
        console.log('User Profile Loaded:', user.fullName);
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('Failed to load user profile:', error);
        this.currentUserSubject.next(null);
        return throwError(() => error);
      })
    );
  }

  private loadInitialUser(): void {
    const token = this.getAccessToken();
    if (token) {
      this.fetchUserProfile().subscribe();
    }
    else {
      this.currentUserSubject.next(null);
    }
  }

  login(credentials: LoginRequest): Observable<UserProfile> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: LoginResponse) => {
        this.storeTokens(response.accessToken, response.refreshToken);
      }),
      switchMap(() => this.fetchUserProfile())
    );
  }

  // Corrected version
  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => this.doLogoutCleanUp(),
      error: (err) => {
        console.error('Logout failed on server, but logging out on client.', err);
        this.doLogoutCleanUp();
      }
    });
  }
  private doLogoutCleanUp(): void {
    this.currentUserSubject.next(null);
    this.clearTokensAndNavigate();
  }

  private storeTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }
  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken(); // Get the access token
    if (!token) {
      return false; // No token, user is not logged in
    }
    // Check if the token is expired
    if (this.isTokenExpired(token)) {
      console.warn('AuthService: Access token is expired');
      return false;
    }
    return true; // Token exists and is not expired, user is logged in
  }

  private isTokenExpired(token: string): boolean {
    if (!token) {
      return true;
    }
    try{
      const decoded = jwtDecode<JwtPayload>(token);
      if(!decoded.exp) return true;

      return Date.now() > decoded.exp * 1000;
    }
    catch(e){
      console.error('Failed to decode token:', e);
      return true;
    }
  }
  private clearTokensAndNavigate(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    // Force a full page reload to the login page to clear all application state
    window.location.href = '/login';
  }
  // REFRESHING THE TOKEN
  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();

    if (!refreshToken || !accessToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<TokenResponse>(`${this.apiUrl}/refresh`, { accessToken, refreshToken }).pipe(
      tap((response: TokenResponse) => {
        console.log('Tokens refreshed successfully!');
        this.storeTokens(response.accessToken, response.refreshToken);
      })
    );
  }

  // --- Methods for the Advanced Interceptor ---
  getIsRefreshing() {
    return this.isRefreshing;
  }

  setIsRefreshing(value: boolean) {
    this.isRefreshing = value;
  }

  getRefreshTokenSubject() {
    return this.refreshTokenSubject;
  }

}
