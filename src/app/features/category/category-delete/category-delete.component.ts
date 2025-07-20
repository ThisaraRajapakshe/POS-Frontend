import { Component } from '@angular/core';
import { CategoryService } from  '../../../Core/services/category-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pos-category-delete',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-delete.component.html',
  styleUrl: './category-delete.component.scss'
})
export class CategoryDeleteComponent {
  message: string = '';
  isError: boolean = false;
  categoryId: string = '';

  constructor(private categoryService: CategoryService) { }

  deleteCategory(categoryId: string): void {
    this.categoryService.delete(categoryId).subscribe({
      next: () => {
        this.message = 'Category deleted successfully';
        this.isError = false;
        this.categoryId = ''; // Clear the category ID after deletion
      },
      error: (err) => {
        this.message = 'Failed to delete category';
        console.error('Error deleting category:', err);
        this.isError = true;
      }
    });
  }
  
}
