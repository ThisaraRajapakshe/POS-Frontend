// src/app/auth/auth.interceptor.ts
import { Injectable, Injector, inject } from '@angular/core';
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
import { TockenResponse } from '../models';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private injector = inject(Injector);


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authService = this.injector.get(AuthService);
    const accessToken = authService.getAccessToken();

    if (accessToken) {
      request = this.addTokenHeader(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // We only handle 401 errors and ignore login/refresh endpoints to avoid loops
        if (error.status === 401 && !request.url.includes('/auth/login') && !request.url.includes('/auth/refresh')) {
          return this.handle401Error(request, next, authService);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler, authService: AuthService): Observable<HttpEvent<unknown>> {
    if (!authService.getIsRefreshing()) {
      authService.setIsRefreshing(true);
      authService.getRefreshTokenSubject().next(null);

      // First request triggers the refresh
      return authService.refreshToken().pipe(
        switchMap((tokenResponse: TockenResponse) => {
          authService.setIsRefreshing(false);
          authService.getRefreshTokenSubject().next(tokenResponse.accessToken);
          // Retry the original request with the new token
          return next.handle(this.addTokenHeader(request, tokenResponse.accessToken));
        }),
        catchError((err) => {
          authService.setIsRefreshing(false);
          // If refresh fails (e.g., refresh token expired), log the user out
          authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      // If a refresh is already in progress, wait for it to complete
      return authService.getRefreshTokenSubject().pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => next.handle(this.addTokenHeader(request, jwt)))
      );
    }
  }

  private addTokenHeader(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }
}