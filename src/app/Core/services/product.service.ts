import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from './base-http.service';
import { Product } from '../models/Domains/product.model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, shareReplay, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseHttpService<Product> {

  private products$: Observable<Product[]> ;
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/Product`);
    this.products$ = this.getAll().pipe(
      shareReplay(1), // Cache the result for subsequent subscribers
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(() => error); // Re-throw the error for further handling
      })
    );
  }
}
