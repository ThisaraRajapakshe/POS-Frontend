import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { DailyReport, MonthlyReport, ReportSummary } from '../../models';
import { ReportService } from '../../services/report.service';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'pos-monthly-detailed-report',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule,
    BaseChartDirective,
    MatTableModule
  ],
  templateUrl: './monthly-detailed-report.component.html',
  styleUrl: './monthly-detailed-report.component.scss'
})
export class MonthlyDetailedReportComponent implements OnInit {
    // Aggregated summary for the whole month
  summary: ReportSummary | null = null;

  // Daily breakdown from backend
  dailyReports: DailyReport[] = [];

  loading = false;

  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;   // 1‑based

  months = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' },
    { value: 3, name: 'March' }, { value: 4, name: 'April' },
    { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' },
    { value: 9, name: 'September' }, { value: 10, name: 'October' },
    { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ];

    // Bar chart configuration
  chartData: ChartData<'bar'> = { labels: [], datasets: [] };
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }   // only one metric – sales
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Sales (Rs.)' }
      }
    }
  };

    // Table columns
  displayedColumns: string[] = ['date', 'orders', 'sales', 'profit'];

  private reportService = inject(ReportService);

  ngOnInit(): void {
    this.loadMonth();
  }

  onMonthChange(): void {
    this.loadMonth();
  }

  loadMonth(): void {
    this.loading = true;
    this.reportService.getMonthlyDetailed(this.selectedYear, this.selectedMonth)
      .subscribe({
        next: (data: MonthlyReport) => {
          this.summary = data.monthlySummary;
          this.dailyReports = data.dailyReports || [];
          this.loading = false;
          this.updateChartData();
        },
        error: (err) => {
          console.error('Failed to load monthly report', err);
          this.loading = false;
        }
      });
  }

  private updateChartData(): void {
    if (!this.dailyReports || this.dailyReports.length === 0) {
      this.chartData = { labels: [], datasets: [] };
      return;
    }

    // Number of days in the selected month
    const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();

    // Labels: day numbers 1…31
    const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());

    // Fill sales data array, default 0 for days with no data
    const salesData = new Array(daysInMonth).fill(0);

    for (const day of this.dailyReports) {
      const dayOfMonth = new Date(day.date).getDate();  // 1‑31
      salesData[dayOfMonth - 1] = day.summary.totalSales;
    }

    this.chartData = {
      labels: labels,
      datasets: [
        {
          data: salesData,
          label: 'Sales (Rs.)',
          backgroundColor: '#66BB6A',
          hoverBackgroundColor: '#43A047'
        }
      ]
    };
  }
}
