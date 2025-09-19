import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiurl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  // For handling token refresh state to prevent multiple calls
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiurl}/login`, credentials).pipe(
      tap((response: any)=>{
        this.storeTokens(response.accessToken, response.refreshToken);
      })
    );
  }
 
  logout(): void {
    // call the backend /logout endpoint
    this.http.post(`${this.apiurl}/logout`, {}).subscribe({
      next: () => this.clearTokensAndNavigate(),
      error: (err) => {
        console.error('Logout failed', err);
        this.clearTokensAndNavigate(); // Logout on frontend even if backend fails
      }
    });
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
    if (!token){
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

    // The token is in three parts: header.payload.signature
    const payload = JSON.parse(atob(token.split('.')[1]));

    // The 'exp' claim is in seconds, convert it to milliseconds
    const expiry = payload.exp * 1000;

    // Check if the expiration time is in the past
    return Date.now() > expiry;
  }
  private clearTokensAndNavigate(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    // Force a full page reload to the login page to clear all application state
    window.location.href = '/login';
  }
  // REFRESHING THE TOKEN
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();

    if (!refreshToken || !accessToken) {
      return new Observable(observer => observer.error('No refresh token available'));
    }

    return this.http.post(`${environment.apiUrl}/refresh`, { accessToken, refreshToken }).pipe(
      tap((response: any) => {
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
