import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from '../../../Core/services/base-http.service';
import { Product } from '../models/product/product.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, shareReplay, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseHttpService<Product> {

  private products$: Observable<Product[]>;
  constructor() {
    const http = inject(HttpClient);

    super(http, `${environment.apiUrl}/Product`);
    this.products$ = this.getAll().pipe(
      shareReplay(1), // Cache the result for subsequent subscribers
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(() => error); // Re-throw the error for further handling
      })
    );
  }
  getByCategory(categoryId: string): Observable<Product[]> {
    const url = `${environment.apiUrl}/product/category/${categoryId}`;
    return this.http.get<Product[]>(url).pipe(
      catchError((error) => {
        console.error(`Error fetching products by category (${categoryId}):`, error);
        return throwError(() => error);
      })
    );
  }
}
