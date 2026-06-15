import { Component, inject, OnInit } from '@angular/core';
import { DailyReport, ReportSummary } from '../../models';
import { ChartData, ChartOptions } from 'chart.js';
import { ReportService } from '../../services/report.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'pos-weekly-report',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatProgressSpinnerModule,
    BaseChartDirective
  ],
  templateUrl: './weekly-report.component.html',
  styleUrl: './weekly-report.component.scss'
})
export class WeeklyReportComponent implements OnInit {

  reports: DailyReport[] = [];
  loading = false;
  selectedDate: Date = new Date(); // default to current week

    // Aggregated weekly totals
  weeklySummary: ReportSummary = {
    totalOrders: 0,
    totalSales: 0,
    totalCost: 0,
    grossProfit: 0,
    totalItemsSold: 0,
    averageOrderValue: 0
  };

  // Chart
  chartData: ChartData<'bar'> = { labels: [], datasets: [] };
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  // Table
  displayedColumns: string[] = ['date', 'orders', 'sales', 'profit'];

  private reportService = inject(ReportService);

  ngOnInit(): void {
        // Default to current week's Monday
    this.selectedDate = this.getMonday(new Date());
    this.loadWeek();
  }

    // Helper: get Monday of the week containing a given date
  private getMonday(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay(); // 0=Sun, 1=Mon, …
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

   // Format date as yyyy-MM-dd (for API)
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Called when user picks a new date in the picker
  onDateChange(date: Date | null): void {
    if (date) {
      this.selectedDate = this.getMonday(date);
      this.loadWeek();
    }
  }

    loadWeek(): void {
    this.loading = true;
    const weekStartStr = this.formatDate(this.selectedDate);
    this.reportService.getWeeklyReport(weekStartStr).subscribe({
      next: (data) => {
        this.reports = data;
        this.computeWeeklySummary();
        this.updateChart();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  private computeWeeklySummary(): void {
    const sum = this.reports.reduce((acc, r) => {
      acc.totalOrders += r.summary.totalOrders;
      acc.totalSales += r.summary.totalSales;
      acc.totalCost += r.summary.totalCost;
      acc.grossProfit += r.summary.grossProfit;
      acc.totalItemsSold += r.summary.totalItemsSold;
      return acc;
    }, {
      totalOrders: 0, totalSales: 0, totalCost: 0,
      grossProfit: 0, totalItemsSold: 0, averageOrderValue: 0
    });
    sum.averageOrderValue = sum.totalOrders > 0 ? sum.totalSales / sum.totalOrders : 0;
    this.weeklySummary = sum;
  }

  private updateChart(): void {
    // Build an array of 7 days, fill with actual sales
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const salesByDay = new Array(7).fill(0);

    this.reports.forEach(r => {
      const d = new Date(r.date);
      const dayIndex = (d.getDay() + 6) % 7; // convert Sun‑Sat to Mon‑Sun index
      salesByDay[dayIndex] = r.summary.totalSales;
    });

    this.chartData = {
      labels: dayNames,
      datasets: [
        {
          data: salesByDay,
          label: 'Sales (Rs.)',
          backgroundColor: '#66BB6A'
        }
      ]
    };
  }
}
