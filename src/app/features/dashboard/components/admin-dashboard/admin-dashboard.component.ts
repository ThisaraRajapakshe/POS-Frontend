import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UserRegisterComponent } from '../../../../auth/register/components/user-register/user-register.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../../../../auth/change-password/change-password.component';
import { AdminDashboardDto } from '../../models/adminDashboardDto';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'pos-admin-dashboard',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
 
  stats : AdminDashboardDto = {
    totalRevenue: 0,
    ordersToday: 0,
    lowStockAlerts: 0
  }
  date! : Date;
  // pop-up - mat-dialog for adding staff 
  private dialog = inject(MatDialog);
  private dashboardService = inject(DashboardService);
  constructor() {
    setInterval(() => {
      this.date = new Date()
    }, 1000);
  }
  ngOnInit() {
    // SIMULATION: Fetching data from an API
    this.getStats();
  
  }
  openAddStaffDialog() {
    // Logic to open the UserRegisterComponent as a dialog
    // This would typically involve using MatDialog from Angular Material
    this.dialog.open(UserRegisterComponent, {
      width: '400px',
    });
  }

  openPasswordChangeDialog() {
    // Logic to open the ChangePasswordComponent as a dialog
    // This would typically involve using MatDialog from Angular Material
    this.dialog.open(ChangePasswordComponent, {
      width: '400px',
    });
  }

  getStats(){
    // Simulate an API call to fetch dashboard stats
    this.dashboardService.getAdminDashboardData().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Error fetching dashboard data', err);
      }
    });
  }
}
