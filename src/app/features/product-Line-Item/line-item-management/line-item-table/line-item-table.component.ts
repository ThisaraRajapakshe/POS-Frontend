import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductLineItem } from '../../../../Core/models/Domains/product-line-item.model';
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
  @Input() lineItems$!: Observable<ProductLineItem[]>;
  @Output() editLineItem = new EventEmitter<ProductLineItem>();
  @Output() deleteLineItem = new EventEmitter<ProductLineItem>();

  displayedColumns: string[] = ['id', 'barCodeId', 'productId', 'productName', 'cost', 'displayPrice', 'discountedPrice', 'actions'];
  dataSource = new MatTableDataSource<ProductLineItem>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

 ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
    switch (property) {
      case 'productName': return item.product?.name;
      default: return (item as any)[property];
    }
  };

    this.lineItems$.subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  onEdit(lineItem: ProductLineItem): void {
    this.editLineItem.emit(lineItem);
  }

  onDelete(lineItem: ProductLineItem): void {
    this.deleteLineItem.emit(lineItem);

  }
}
