
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { Category } from './../../../models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'pos-category-table',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatSortModule],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.scss'
})
export class CategoryTableComponent implements OnChanges {
  @Input() categories$!: Observable<Category[]>;
  @Output() editCategory = new EventEmitter<Category>();
  @Output() deleteCategory = new EventEmitter<Category>();

  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Category>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private subscription!: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories$'] && this.categories$) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      this.subscription = this.categories$.subscribe(data => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = data;

      });
    }
  }
  onEdit(category: Category): void {
    this.editCategory.emit(category);
  } 

  onDelete(category: Category): void {
    this.deleteCategory.emit(category);
  }
  
}
