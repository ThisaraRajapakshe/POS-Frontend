import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UserRegisterComponent } from '../../../../auth/register/components/user-register/user-register.component';
import { MatDialog } from '@angular/material/dialog';
interface AdminStats {
  totalRevenue: number;
  ordersCount: number;
  lowStockItems: number;
  activeStaff: number;
}
@Component({
  selector: 'pos-admin-dashboard',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  // Signal to hold dashboard state.
  // In a real app, this would be populated by a Service call.
  stats = signal<AdminStats>({
    totalRevenue: 0,
    ordersCount: 0,
    lowStockItems: 0,
    activeStaff: 0,
  });
  date! : Date;
  // pop-up - mat-dialog for adding staff 
  private dialog = inject(MatDialog);
  constructor() {
    setInterval(() => {
      this.date = new Date()
    }, 1000);
  }
  ngOnInit() {
    // SIMULATION: Fetching data from an API
    // Replace this with: this.dashboardService.getStats().subscribe(...)
    setTimeout(() => {
      this.stats.set({
        totalRevenue: 125430,
        ordersCount: 45,
        lowStockItems: 3,
        activeStaff: 5,
      });
    }, 500);
  }
  openAddStaffDialog() {
    // Logic to open the UserRegisterComponent as a dialog
    // This would typically involve using MatDialog from Angular Material
    this.dialog.open(UserRegisterComponent, {
      width: '400px',
    });
  }
}
