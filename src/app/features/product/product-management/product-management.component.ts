import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog.component';
import { ProductService } from '../../../Core/services/product.service';
import { Product } from '../../../Core/models/Domains/product.model';
import { ProductTableComponent } from './product-table/product-table.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { CardWrapperComponent } from '../../../shared/Components/card-wrapper/card-wrapper.component';

@Component({
  selector: 'pos-product-management',
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss',
  standalone: true,
  imports: [ProductTableComponent, MatButton, CardWrapperComponent, MatButtonModule],
})
export class ProductManagementComponent implements OnInit {
  products$!: Observable<Product[]>;
  constructor(private dialog: MatDialog, private productService: ProductService) {}
  ngOnInit(): void {
    this.products$ = this.productService.getAll();
  }
  openAddProduct() {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      data: { mode: 'create' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.create(result).subscribe(() => {
          this.products$ = this.productService.getAll();
        });
      }
    });
  }

  openEditProduct(product: Product) {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      data: { mode: 'edit', product },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.update(product.id, result).subscribe(() => {
          this.products$ = this.productService.getAll();
        });
      }
    });
  }

  confirmDelete(product: Product) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Delete this product "${product.name}"?`, title: 'Confirm Deletion', confirmButtonText: 'Delete', cancelButtonText: 'Cancel' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.delete(product.id).subscribe(() => {
          this.products$ = this.productService.getAll();
        });
      }
    });
  }
}
