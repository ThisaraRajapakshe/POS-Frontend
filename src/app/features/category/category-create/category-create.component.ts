import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryService } from '../../../Core/services/category-service.service';
import { Category } from '../../../Core/models/Domains/category.model';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'pos-category-create',
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.scss'
})
export class CategoryCreateComponent {
  categoryForm!: FormGroup;
  submissionError: boolean = false;
  message: string = '';

  constructor(private fb: FormBuilder, private categoryService: CategoryService) { }
  // Initialize the form with validation
  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      id: [''],
      name: [''],
    });
  }
  onSubmit() {
    const categoryData: Category = this.categoryForm.value;
    this.categoryService.create(categoryData).subscribe({
      next: (response) => {
        console.log('Category created successfully:', response);
        this.message = 'Category created successfully';
        this.submissionError = false;
        this.categoryForm.reset(); // Reset the form after successful submission
      },
      error: (error) => {
        console.error('Error creating category:', error);
        this.message = 'Error creating category. Please try again.';
        this.submissionError = true;
      }
    });
  }
}
