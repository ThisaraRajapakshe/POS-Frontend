import { Injectable, inject } from '@angular/core';
import { BaseHttpService } from '../../../Core/services/base-http.service';
import { ProductLineItem } from '../models/line-item/product-line-item.model';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateProductLineItemDto } from '../models/line-item/create-product-line-item-dto';
import { UpdateProductLineItemDto } from '../models/line-item/update-product-line-item-dto';


@Injectable({
  providedIn: 'root'
})
export class ProductLineItemService extends BaseHttpService<ProductLineItem, CreateProductLineItemDto, UpdateProductLineItemDto> {

  private productLineItems$!: Observable<ProductLineItem[]>;
  constructor() {
    const http = inject(HttpClient);

    super(http, `${environment.apiUrl}/ProductLineItem`);
    this.productLineItems$ = this.getAll().pipe(
      shareReplay(1), // Cache the result for subsequent subscribers
      catchError((error) => {
        console.error('Error fetching product line items:', error);
        return throwError(() => error); // Re-throw the error for further handling
      })
    );
  }
  getByProduct(productId: string): Observable<ProductLineItem[]> {
    const url = `${environment.apiUrl}/ProductLineItem/product/${productId}`;
    return this.http.get<ProductLineItem[]>(url).pipe(
      shareReplay(1),
      catchError((error) => {
        console.error(`Error fetching product line items by product:${productId}`, error);
        return throwError(() => error);
      })
    );
  }
}
