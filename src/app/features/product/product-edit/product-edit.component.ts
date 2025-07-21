import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../../Core/services/product.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CardWrapperComponent } from '../../../shared/Components/card-wrapper/card-wrapper.component';

@Component({
  selector: 'pos-product-edit',
  imports: [CommonModule, ReactiveFormsModule, CardWrapperComponent],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent {
  productForm: FormGroup;
  submissionError: boolean = false;
  message: string = '';

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const updatedProduct = this.productForm.value;
      const productId = updatedProduct.id;

      this.productService.update(productId, updatedProduct).subscribe({
        next: () => {
          // Handle successful update
          this.message = 'Product updated successfully';
          this.submissionError = false;
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.message = 'Error updating product';
          this.submissionError = true;
        }
      });
    }
  }

}

