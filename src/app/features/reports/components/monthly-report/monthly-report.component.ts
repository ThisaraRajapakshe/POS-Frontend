import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ReportService } from '../../services/report.service';
import { ReportSummary, DailyReport } from '../../models';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'pos-monthly-report',
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
  templateUrl: './monthly-report.component.html',
  styleUrl: './monthly-report.component.scss'
})
export class MonthlyReportComponent implements OnInit {

  summary: ReportSummary | null = null;

  // Daily breakdown data for chart and table
  dailyReports: DailyReport[] = [];

  loading = false;

  // Selected month/year
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;   // 1-based

  // Month names for the select
  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];
  
  // Chart – will show one bar (total sales)
  chartData: ChartData<'bar'> = { labels: [], datasets: [] };
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  // Table – display the summary in a single row
  displayedColumns: string[] = ['metric', 'value'];
  // We'll build an array of { metric, value } for the table
  summaryRows: { metric: string; value: string }[] = [];



  private reportService = inject(ReportService);

  ngOnInit(): void {
    this.loadMonth();
  }

  onMonthChange(): void {
    this.loadMonth();
  }
    loadMonth(): void {
    this.loading = true;
    this.reportService.getMonthlyReport(this.selectedYear, this.selectedMonth)
      .subscribe({
        next: (data: ReportSummary) => {
          this.summary = data;
          this.buildSummaryRows();
          this.updateChart();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  private buildSummaryRows(): void {
    if (!this.summary) {
      this.summaryRows = [];
      return;
    }
    this.summaryRows = [
      { metric: 'Total Orders',        value: this.summary.totalOrders.toString() },
      { metric: 'Total Sales',         value: 'Rs. ' + this.summary.totalSales.toFixed(2) },
      { metric: 'Total Cost',          value: 'Rs. ' + this.summary.totalCost.toFixed(2) },
      { metric: 'Gross Profit',        value: 'Rs. ' + this.summary.grossProfit.toFixed(2) },
      { metric: 'Total Items Sold',    value: this.summary.totalItemsSold.toString() },
      { metric: 'Avg Order Value',     value: 'Rs. ' + this.summary.averageOrderValue.toFixed(2) }
    ];
  }

  private updateChart(): void {
    if (!this.summary) {
      this.chartData = { labels: [], datasets: [] };
      return;
    }
    // One bar for total sales
    this.chartData = {
      labels: ['Total Sales'],
      datasets: [
        {
          data: [this.summary.totalSales],
          label: 'Sales',
          backgroundColor: '#66BB6A'
        }
      ]
    };
  }
}
