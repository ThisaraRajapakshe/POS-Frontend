import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog.component';
import { ProductService } from '../../services';
import { Product } from './../../models';
import { ProductTableComponent } from './product-table/product-table.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardWrapperComponent } from '../../../../shared/Components/card-wrapper/card-wrapper.component';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog.component';
import { filterData } from '../../../../shared/utils/search-helper';
import { SearchBarComponent } from '../../../../shared/Components/search-bar/search-bar.component';

@Component({
  selector: 'pos-product-management',
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss',
  standalone: true,
  imports: [ProductTableComponent, MatButton, CardWrapperComponent, MatButtonModule, SearchBarComponent],
})
export class ProductManagementComponent implements OnInit {
  private dialog = inject(MatDialog);
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  products: WritableSignal<Product[]> = signal([]);
  private allProducts: Product[] = [];
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
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products.set(products);
        this.allProducts = products;
      },
      error: (error) => {
        this.snackBar.open('Failed to load products', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        console.error('Error loading products:', error);
        return ([]); // Return an empty array on error
      }
    });
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

  // Search Functionality
  onSearchProducts(searchTerm: string){
    // if(!searchTerm || searchTerm.trim() === ''){
    //   this.products.set(this.allProducts);
    //   return;
    // }

    // // Normalize text for case-insensitive search
    // const lowerTerm = searchTerm.toLowerCase();

    // // Filter the Master Backup
    // const filtered = this.allProducts.filter(p => 
    //   p.name.toLowerCase().includes(lowerTerm)
    // );

    // // Update the displayed list
    // this.products.set(filtered);

    const filtered = filterData(searchTerm, this.allProducts, ['name', 'category.name']);
  
    this.products.set(filtered);
  }
}
