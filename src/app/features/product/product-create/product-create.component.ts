import { Component } from '@angular/core';
import { Product } from '../../../Core/models/Domains/product.model';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../Core/services/product.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'pos-product-create',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})
export class ProductCreateComponent implements OnInit {

  productForm!: FormGroup;
  submissionError : boolean = false;
  message : string = '';

  constructor(private formBuilder: FormBuilder, private productService: ProductService) { }
  ngOnInit(): void {
    // Initialize the form with validation
    this.productForm = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      console.log('Sending product data:', product);
      this.productService.create(product).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          this.message = 'Product created successfully';
          this.submissionError = false;
          this.productForm.reset(); // Reset the form after successful submission
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.submissionError = true;
          this.message = 'Failed to create product. Please try again.';
        }
      });
    }

  }
}
