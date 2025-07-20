import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../Core/services/category-service.service';
import { UpdateCategoryDto } from '../../../Core/models/Dtos/update-category-dto';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pos-category-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.scss'
})
export class CategoryEditComponent {
  categoryForm!: FormGroup;
  submissionError: boolean = false;
  message: string = '';
  constructor(fb: FormBuilder, private categoryService: CategoryService) {
    this.categoryForm = fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.categoryForm.valid) {
      const updatedCategory: UpdateCategoryDto = this.categoryForm.value;
      const id = this.categoryForm.value.id;

      this.categoryService.update(id, updatedCategory ).subscribe({
        next: () => {
          // Handle successful update
          this.message = 'Category updated successfully';
          this.submissionError = false;
          this.categoryForm.reset();
        },
        error: (error) => {
          console.error('Error updating Category:', error);
          this.message = 'Error updating Category';
          this.submissionError = true;
        }
      });
    }
  }
}
