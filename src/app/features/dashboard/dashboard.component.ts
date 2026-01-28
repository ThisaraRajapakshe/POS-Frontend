import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../Core/services/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserRole } from '../../Core/models';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CashierDashboardComponent } from './components/cashier-dashboard/cashier-dashboard.component';
import { StockClerkDashboardComponent } from './components/stock-clerk-dashboard/stock-clerk-dashboard.component';

@Component({
  selector: 'pos-dashboard',
  imports: [AdminDashboardComponent, CashierDashboardComponent, StockClerkDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  public Roles = UserRole;

  private userSignal = toSignal(this.authService.currentUser$, { requireSync: false });
  userRoles = computed(() => {
    const user = this.userSignal();
    return user?.roles || [];
  });
  hasRole(role: UserRole): boolean {
    return this.userRoles().includes(role);
  }
}
