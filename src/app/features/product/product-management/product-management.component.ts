import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog.component';
import { ProductService } from '../../../Core/services/product.service';
import { Product } from '../../../Core/models/Domains/product.model';
import { ProductTableComponent } from './product-table/product-table.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { catchError, Observable, of } from 'rxjs';
import { CardWrapperComponent } from '../../../shared/Components/card-wrapper/card-wrapper.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pos-product-management',
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss',
  standalone: true,
  imports: [ProductTableComponent, MatButton, CardWrapperComponent, MatButtonModule],
})
export class ProductManagementComponent implements OnInit {
  products$!: Observable<Product[]>;
  constructor(private dialog: MatDialog, private productService: ProductService, private snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.loadProducts();
  }
  openAddProduct() {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      data: { mode: 'create' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.create(result).subscribe({
          next: () => {
            this.loadProducts();
            this.snackBar.open('Product created successfully', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          },
          error: (error) => {
            this.snackBar.open('Failed to create product', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
            console.error('Error creating product:', error);
          }
        });
      }
    });
  }

  loadProducts() {
    this.products$ = this.productService.getAll().pipe(
      catchError(error => {
        this.snackBar.open('Failed to load products', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        console.error('Error loading products:', error);
        return of([]); // Return an empty array on error
      })
    );
  }

  openEditProduct(product: Product) {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      data: { mode: 'edit', product },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.update(product.id, result).subscribe({
          next: () => {
            this.loadProducts();
            this.snackBar.open('Product updated successfully', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success'],
            });
          },
          error: (error) => {
            this.snackBar.open('Failed to update product', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
            console.error('Error updating product:', error);
          }
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
        this.productService.delete(product.id).subscribe({
          next: () => {
            this.loadProducts();
            this.snackBar.open('Product deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success'],
            });
          },
          error: (error) => {
            this.snackBar.open('Failed to delete product', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
            console.error('Error deleting product:', error);
          }
        });
      }
    });
  }
}
