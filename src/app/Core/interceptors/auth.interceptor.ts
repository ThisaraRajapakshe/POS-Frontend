// src/app/auth/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.authService.getAccessToken();

if (accessToken) {
      request = this.addTokenHeader(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // We only handle 401 errors and ignore login/refresh endpoints to avoid loops
        if (error.status === 401 && !request.url.includes('/auth/login') && !request.url.includes('/auth/refresh')) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.authService.getIsRefreshing()) {
      this.authService.setIsRefreshing(true);
      this.authService.getRefreshTokenSubject().next(null);

      // First request triggers the refresh
      return this.authService.refreshToken().pipe(
        switchMap((tokenResponse: any) => {
          this.authService.setIsRefreshing(false);
          this.authService.getRefreshTokenSubject().next(tokenResponse.accessToken);
          // Retry the original request with the new token
          return next.handle(this.addTokenHeader(request, tokenResponse.accessToken));
        }),
        catchError((err) => {
          this.authService.setIsRefreshing(false);
          // If refresh fails (e.g., refresh token expired), log the user out
          this.authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      // If a refresh is already in progress, wait for it to complete
      return this.authService.getRefreshTokenSubject().pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => next.handle(this.addTokenHeader(request, jwt)))
      );
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }
}