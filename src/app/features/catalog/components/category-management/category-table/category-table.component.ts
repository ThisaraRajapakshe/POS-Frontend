
import { AfterViewInit, Component, effect, EventEmitter, input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Category } from './../../../models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'pos-category-table',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatSortModule],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.scss'
})
export class CategoryTableComponent implements AfterViewInit {
  categories =  input<Category[]>([]);

  @Output() editCategory = new EventEmitter<Category>();
  @Output() deleteCategory = new EventEmitter<Category>();

  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Category>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(){
    effect(()=> {
      const data = this.categories();
      this.dataSource.data = data;
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onEdit(category: Category): void {
    this.editCategory.emit(category);
  } 

  onDelete(category: Category): void {
    this.deleteCategory.emit(category);
  }
  
}
