import { Injectable } from '@angular/core';
import { Category } from '../models/Domains/category.model';
import { BaseHttpService } from './base-http.service';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { UpdateCategoryDto } from '../models/Dtos/update-category-dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseHttpService<Category, Category, UpdateCategoryDto> {
  private categories$!: Observable<Category[]>;
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/Category`);
    this.categories$ = this.getAll().pipe(
      shareReplay(1), // Cache the result for subsequent subscribers
      catchError((error) => {
        console.error('Error fetching categories:', error);
        return throwError(() => error); // Re-throw the error for further handling
      })
    );
  }
}
