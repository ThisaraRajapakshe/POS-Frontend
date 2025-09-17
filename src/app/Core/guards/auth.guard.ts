import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    console.log('AuthGuard: User is logged in, access granted');
    return true; // User is logged in, allow access
    
  } else {
    // User is not logged in, redirect to the login page
    // ADD THIS LINE FOR DEBUGGING
    console.log('AuthGuard: User not logged in, redirecting to /login');
    
    router.navigate(['/login']);
    return false;
  }
};