import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductLineItemService } from '../../../Core/services/product-line-item.service';
import { UpdateProductLineItemDto } from '../../../Core/models/Dtos/update-product-line-item-dto';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pos-product-line-item-edit',
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './product-line-item-edit.component.html',
  styleUrl: './product-line-item-edit.component.scss'
})
export class ProductLineItemEditComponent {
  productLineItemForm: FormGroup;
  submissionError: boolean = false;
  message: string = '';
  constructor(formBuilder: FormBuilder, private productLineItemService: ProductLineItemService){
    this.productLineItemForm = formBuilder.group({
      id: ['', Validators.required],
      barCodeId: ['', Validators.required],
      productId: ['', Validators.required],
      cost: [0, Validators.required],
      displayPrice: [0, Validators.required],
      discountedPrice: [0, Validators.required]
    });
  }
  onSubmit() {
    if (this.productLineItemForm.valid) {
      const updatedProductLineItem: UpdateProductLineItemDto = this.productLineItemForm.value;
      const id = this.productLineItemForm.value.id;

      this.productLineItemService.update(id, updatedProductLineItem).subscribe({
        next: () => {
          // Handle successful update
          this.message = 'Product Line Item updated successfully';
          this.submissionError = false;
          this.productLineItemForm.reset();
        },
        error: (error) => {
          console.error('Error updating Product Line Item:', error);
          this.message = 'Error updating Product Line Item';
          this.submissionError = true;
        }
      });
    }
  }
}
