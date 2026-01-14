import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../Core/services/auth/auth.service';
import { UserProfile } from '../../../Core/models/Domains/UserProfile';

@Component({
  selector: 'pos-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,
    RouterOutlet,
    CommonModule,
  ]
})
export class NavBarComponent {
  private authService = inject(AuthService);

  private breakpointObserver = inject(BreakpointObserver);
  currentUser$: Observable<UserProfile | null>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
    constructor() {
      this.currentUser$ = this.authService.currentUser$.pipe(
        filter(userState => userState !== undefined) // Only emit when userState is defined (not undefined)
      ) as Observable<UserProfile | null>; // Type assertion to ensure correct type
    }
    onLogout(): void {
      this.authService.logout();
    }
}
