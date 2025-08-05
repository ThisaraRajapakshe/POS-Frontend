import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../../../../Core/models/Domains/category.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'pos-category-table',
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatSortModule],
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

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;

  //   this.categories$.subscribe(categories => {
  //     this.dataSource.data = categories;
      
  //   });
  // }

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
