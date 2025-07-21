import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductLineItemService } from '../../../Core/services/product-line-item.service';
import { CreateProductLineItemDto } from '../../../Core/models/Dtos/create-product-line-item-dto';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardWrapperComponent } from '../../../shared/Components/card-wrapper/card-wrapper.component';

@Component({
  selector: 'pos-product-line-item-create',
  imports: [ReactiveFormsModule, CommonModule, CardWrapperComponent],
  templateUrl: './product-line-item-create.component.html',
  styleUrl: './product-line-item-create.component.scss'
})
export class ProductLineItemCreateComponent implements OnInit {
  productLineItemForm!: FormGroup;
  submissionError: boolean = false;
  message: string = '';

  constructor(private formBuilder: FormBuilder, private productLineItemService: ProductLineItemService) { }
  // Initialize the form with validation
  ngOnInit(): void {
    this.productLineItemForm = this.formBuilder.group({
      id: ['', Validators.required],
      barCodeId: ['', Validators.required],
      productId: ['', Validators.required],
      cost: [0, Validators.required],
      displayPrice: [0, Validators.required],
      discountedPrice: [0, Validators.required]
    });
  }
  onSubmit() {
    const productLineItem: CreateProductLineItemDto = this.productLineItemForm.value;
    this.productLineItemService.create(productLineItem).subscribe({
      next: (response) => {
        console.log('Product line item created successfully:', response);
        this.message = 'Product line item created successfully';
        this.submissionError = false;
        this.productLineItemForm.reset(); // Reset the form after successful submission
      },
      error: (error) => {
        console.error('Error creating product line item:', error);
        this.message = 'Error creating product line item. Please try again.';
        this.submissionError = true;
      }
    });
  }
}
