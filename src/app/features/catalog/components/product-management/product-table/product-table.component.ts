import { Component, Input, ViewChild, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../../../models';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'pos-product-table',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss'
})
export class ProductTableComponent implements OnChanges {
  @Input() products$!: Observable<Product[]>;
  @Output() editProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<Product>();

  displayedColumns: string[] = ['id', 'name', 'category', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private subscription!: Subscription;
  ngOnChanges(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.products$.subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'category': return item.category?.name;
          default: return (item as any)[property];
        }
      };
    });
  }

  onEdit(product: Product): void {
    this.editProduct.emit(product);
  }

  onDelete(product: Product): void {
    this.deleteProduct.emit(product);
  }

}
