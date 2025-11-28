import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '../services/auth/auth.service';
import { catchError, filter, map, of, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    filter(userState => userState !== undefined),
    take(1),
    map(user => {
      if (user) {
        console.log('AuthGuard: User is logged in, access granted');
        return true; // User is logged in, allow access

      } else {
        // User is not logged in, redirect to the login page
        // ADD THIS LINE FOR DEBUGGING
        console.log('AuthGuard: No active session. Access DENIED. Redirecting...');
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      console.error('AuthGuard: Error in authentication stream. Redirecting to login.');
      router.navigate(['/login']);
      return of(false);
    })
  );
};