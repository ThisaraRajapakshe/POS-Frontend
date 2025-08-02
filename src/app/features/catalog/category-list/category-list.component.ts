import { Component, EventEmitter, Output, ChangeDetectionStrategy, signal } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { Category } from '../../../Core/models/Domains/category.model';
import { CategoryService } from '../../../Core/services/category-service.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from "./product-list/product-list.component";

@Component({
  selector: 'pos-category-list',
  imports: [MatExpansionModule, CommonModule, ProductListComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryListComponent {
  categories$!: Observable<Category[]>;
  message: string = '';
  @Output() categorySelected = new EventEmitter<string>();
  constructor(private categoryService: CategoryService) { }
  ngOnInit(): void {
    this.loadCategories();
  }
  loadCategories() {
    this.categories$ = this.categoryService.getAll().pipe(
      tap(() => {
        this.message = '';
      }),
      catchError((error) => {
        this.message = 'Error loading categories';
        console.error('Error loading categories:', error);
        return of([]); // Return an empty array on error
      }));
  }
  selectCategory(categoryId: string) {
    this.categorySelected.emit(categoryId);
  }
}
