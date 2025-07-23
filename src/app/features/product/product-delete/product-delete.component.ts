import { Component } from '@angular/core';
import { ProductService } from '../../../Core/services/product.service';
import { CommonModule } from '@angular/common';
import { CardWrapperComponent } from "../../../shared/Components/card-wrapper/card-wrapper.component"; 
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'pos-product-delete',
  imports: [CommonModule, CardWrapperComponent],
  templateUrl: './product-delete.component.html',
  styleUrl: './product-delete.component.scss'
})
export class ProductDeleteComponent {
  message: string = '';
  isError: boolean = false;
  productId: string = '';

  constructor(private productService: ProductService, private dialog: MatDialog) { }
  openConfirmDialog(productId : string){
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{
      data : {message : 'Are you sure you want to delete this Product ?', title : 'Delete Product', confirmButtonText : 'Delete', cancelButtonText : 'Cancel'}
    });
    dialogRef.afterClosed().subscribe(result =>{
      if (result){
        this.deleteProduct(productId)
      }
    })
  }

  // Method to delete a product by its ID
    deleteProduct(productId : string) {
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
