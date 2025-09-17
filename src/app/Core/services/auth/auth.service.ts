import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiurl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

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
      next: () => {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      },
      error: (err) => {
        console.error('Logout failed', err);
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
}
