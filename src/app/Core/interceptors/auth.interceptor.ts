import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { catchError, switchMap, filter, take, throwError } from 'rxjs';
import { TokenResponse } from '../models';

// 1. Define "Ignored" endpoints to prevent circular loops
const IGNORED_URLS = ['/auth/login', '/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();
  const authReq = accessToken ? addTokenHeader(req, accessToken) : req;

  // 2. Handle Request & Errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check for 401, but ignore Login/Refresh calls to prevent infinite loops
      const isIgnoredUrl = IGNORED_URLS.some(url => req.url.includes(url));
      if (error.status === 401 && !isIgnoredUrl) {
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

// --- HELPER FUNCTIONS ---

const addTokenHeader = (request: HttpRequest<unknown>, token: string): HttpRequest<unknown> => {
  return request.clone({
    headers: request.headers.set('Authorization', `Bearer ${token}`)
  });
};

const handle401Error = (
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn, 
  authService: AuthService
) => {
  
  if (!authService.getIsRefreshing()) {
    // A. Start Refresh Process
    authService.setIsRefreshing(true);
    authService.getRefreshTokenSubject().next(null);

    return authService.refreshToken().pipe(
      switchMap((tokenResponse: TokenResponse) => {
        authService.setIsRefreshing(false);
        authService.getRefreshTokenSubject().next(tokenResponse.accessToken);
        
        // Retry with new token
        return next(addTokenHeader(request, tokenResponse.accessToken));
      }),
      catchError((err) => {
        authService.setIsRefreshing(false);
        authService.logout();
        return throwError(() => err);
      })
    );

  } else {
    // B. Queue Request (Wait for refresh to finish)
    return authService.getRefreshTokenSubject().pipe(
      filter(token => token != null),
      take(1),
      switchMap(jwt => next(addTokenHeader(request, jwt!)))
    );
  }
};