import { Component, OnInit, NgModule } from '@angular/core';
import { ProductLineItemService } from '../../../Core/services/product-line-item.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'pos-product-line-item-delete',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-line-item-delete.component.html',
  styleUrl: './product-line-item-delete.component.scss'
})
export class ProductLineItemDeleteComponent implements OnInit {
  message: string = '';
  isError: boolean = false;
  productLineItemId: string = '';
  constructor(private productLineItemService: ProductLineItemService) { }
  // Method to delete a product line item by its ID
  ngOnInit() {
    // Initialization
    this.productLineItemId = '';
  }
  deleteProductLineItem(productLineItemId: string) {
    this.productLineItemService.delete(productLineItemId).subscribe({
      next: () => {
        this.message = 'Product line item deleted successfully';
        this.isError = false;
        this.productLineItemId = '';
      },
      error: (error) => {
        console.error('Error deleting product line item:', error);
        this.message = 'Error deleting product line item';
        this.isError = true;
      }
    });
  }

}
