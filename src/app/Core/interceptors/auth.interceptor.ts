// src/app/auth/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.authService.getAccessToken();

    // If a token exists, clone the request and add the Authorization header
    if (accessToken) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      return next.handle(cloned);
    }

    // Otherwise, let the original request go through
    return next.handle(request);
  }
}