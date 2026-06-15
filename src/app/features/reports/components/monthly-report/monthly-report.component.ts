import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ReportService } from '../../services/report.service';
import { ReportSummary } from '../../models';

@Component({
  selector: 'pos-monthly-report',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './monthly-report.component.html',
  styleUrl: './monthly-report.component.scss'
})
export class MonthlyReportComponent implements OnInit {

  summary: ReportSummary | null = null;
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

  private reportService = inject(ReportService);

  ngOnInit(): void {
    this.loadMonth();
  }

  onMonthChange(): void {
    this.loadMonth();
  }
  loadMonth(): void {
    this.loading = true;
    this.reportService.getMonthlyReport(this.selectedYear, this.selectedMonth).subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
