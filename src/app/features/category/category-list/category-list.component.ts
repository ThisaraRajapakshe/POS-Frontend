import { Component, OnInit } from '@angular/core';
import { catchError, tap, throwError, of, Observable } from 'rxjs';
import { Category } from '../../../Core/models/Domains/category.model';
import { CategoryServiceService } from '../../../Core/services/category-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pos-category-list',
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  categories$!: Observable<Category[]>;
  message: string = '';

  constructor(private categoryService: CategoryServiceService) { }
  ngOnInit(): void {
    //   this.categories$ = this.categoryService.getAll();
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
      })
    );
  }
}
