import { Component } from '@angular/core';
import { CategoryListComponent } from './category-list/category-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pos-catalog',
  imports: [CategoryListComponent, CommonModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {
  selectedCategoryId: string | null = null;
  selectedProductId: string | null = null;

  onCategorySelected(categoryId: string) {
    this.selectedCategoryId = categoryId;
    this.selectedProductId = null; // Reset selected product when a new category is selected
  }
  onProductSelected(productId: string) {
    this.selectedProductId = productId;
  }
}
