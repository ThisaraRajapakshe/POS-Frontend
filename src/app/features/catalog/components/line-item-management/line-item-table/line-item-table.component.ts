import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ProductLineItem } from '../../../models';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'pos-line-item-table',
  imports: [MatTableModule, CommonModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatSortModule],
  templateUrl: './line-item-table.component.html',
  styleUrl: './line-item-table.component.scss'
})
export class LineItemTableComponent implements AfterViewInit {
  @Input() set lineItems(data : ProductLineItem[] | null){
    if (data){
      this.dataSource.data = data;
    }
  }

  @Output() editLineItem = new EventEmitter<ProductLineItem>();
  @Output() deleteLineItem = new EventEmitter<ProductLineItem>();

  displayedColumns: string[] = ['id', 'barCodeId', 'productId', 'productName', 'cost', 'displayPrice', 'discountedPrice', 'quantity', 'actions'];
  dataSource = new MatTableDataSource<ProductLineItem>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.configureSorting();
  }

  configureSorting() {
    this.dataSource.sortingDataAccessor = (item: ProductLineItem, property: string): string | number => {
      switch (property) {
        case 'productName': 
          return item.product?.name || '';
        default: {
          // 3. THE FIX: Strict typing with keyof
          const value = item[property as keyof ProductLineItem];
          return (typeof value === 'string' || typeof value === 'number') ? value : '';
        }
      }
    };
  }
  onEdit(lineItem: ProductLineItem): void {
    this.editLineItem.emit(lineItem);
  }

  onDelete(lineItem: ProductLineItem): void {
    this.deleteLineItem.emit(lineItem);
  }
}
