import { Component, inject, OnInit } from '@angular/core';
import { DailyReport, TopSellingItem } from '../../models';
import { ChartData, ChartOptions } from 'chart.js';
import { ReportService } from '../../services/report.service';
import { MatFormField, MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BaseChartDirective } from 'ng2-charts';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'pos-daily-report',
  imports: [
    MatFormField,
    CommonModule, // required for pipes and built-in directives like @if/@for
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatProgressSpinnerModule,
    BaseChartDirective,
    FormsModule
    
    
],
  templateUrl: './daily-report.component.html',
  styleUrl: './daily-report.component.scss'
})
export class DailyReportComponent implements OnInit {

  displayedColumns: string[] = ['productName', 'quantitySold', 'totalRevenue', 'profit'];

  report: DailyReport | null = null;
  loading = false;
  selectedDate: Date = new Date(); // default to today

    // Chart configuration
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartOptions<'bar'> = { responsive: true };

  //Service injection for fetching report data would go here
  private reportService = inject(ReportService);

  ngOnInit(): void {
    this.loadReport(this.formatDate(this.selectedDate));
  }
  // Called by Datepicker when user selects a date
  onDateChange(date: Date | null): void {
    if (date) {
      this.selectedDate = date;
      this.loadReport(this.formatDate(date));
    }
  }

  // Helper: convert Date to 'yyyy-MM-dd'
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

    loadReport(date: string): void {
    this.loading = true;
    this.reportService.getDailyReport(date).subscribe({
      next: (data) => {
        this.report = data;
        this.prepareChart(data.topSellingItems);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  private prepareChart(items: TopSellingItem[]): void {
  // Sort by revenue descending, take top 10
  const sorted = [...items].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 10);
  
  this.barChartData = {
    labels: sorted.map(i => i.productName),
    datasets: [
      {
        data: sorted.map(i => i.totalRevenue),
        label: 'Revenue (Rs.)',
        backgroundColor: '#66BB6A'
      }
    ]
  };

  // Set indexAxis for horizontal bars
  this.barChartOptions = {
    indexAxis: 'x',   // horizontal bars
    responsive: true,
    plugins: {
      legend: { display: false }   // hide legend for a single dataset
    }
  };
}

}
