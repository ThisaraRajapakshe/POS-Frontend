import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Category } from '../../../../Core/models/Domains/category.model';
import { V } from '@angular/cdk/keycodes';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'pos-category-table',
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.scss'
})
export class CategoryTableComponent {
  @Input() categories$!: Observable<Category[]>;
  @Output() editCategory = new EventEmitter<Category>();
  @Output() deleteCategory = new EventEmitter<Category>();

  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Category>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.categories$.subscribe(categories => {
      this.dataSource.data = categories;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  onEdit(category: Category): void {
    this.editCategory.emit(category);
  } 

  onDelete(category: Category): void {
    this.deleteCategory.emit(category);
  }
  
}
