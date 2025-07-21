import { Component } from '@angular/core';
import { ProductService } from '../../../Core/services/product.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'pos-product-delete',
  imports: [ CommonModule ],
  templateUrl: './product-delete.component.html',
  styleUrl: './product-delete.component.scss'
})
export class ProductDeleteComponent {
  message: string = '';
  isError: boolean = false;

  constructor(private productService: ProductService) { }
  // Method to delete a product by its ID
    deleteProduct(productId: string) {
      this.productService.delete(productId).subscribe({
        next: () => {
          this.message = 'Product deleted successfully';
          this.isError = false;
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.message = 'Error deleting product';
          this.isError = true;
        }
      });
  }

}
