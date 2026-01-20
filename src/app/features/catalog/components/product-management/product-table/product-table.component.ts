import { Component, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../../models';



@Component({
  selector: 'pos-product-table',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss'
})
export class ProductTableComponent implements AfterViewInit {
  @Input() set products(products: Product[]) {
    this.dataSource.data = products;
  }
  @Output() editProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<Product>();

  displayedColumns: string[] = ['id', 'name', 'category', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.configureSorting();
  }

  private configureSorting(){
    this.dataSource.sortingDataAccessor = (item: Product, property: string): string | number => {
      switch (property) {
        case 'category': return item.category?.name || '';
        default: 
        {
          const value = item[property as keyof Product];
          return ( typeof value === 'string' || typeof value === 'number' ) ? value : '';
        }
      }
    };
  }

  onEdit(product: Product): void {
    this.editProduct.emit(product);
  }

  onDelete(product: Product): void {
    this.deleteProduct.emit(product);
  }

}
