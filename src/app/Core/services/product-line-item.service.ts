import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { ProductLineItem } from '../models/Domains/product-line-item.model';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateProductLineItemDto } from '../models/Dtos/create-product-line-item-dto';
import { UpdateProductLineItemDto } from '../models/Dtos/update-product-line-item-dto';


@Injectable({
  providedIn: 'root'
})
export class ProductLineItemService extends BaseHttpService<ProductLineItem, CreateProductLineItemDto, UpdateProductLineItemDto> {

  private productLineItems$!: Observable<ProductLineItem[]>;
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/ProductLineItem`);
    this.productLineItems$ = this.getAll().pipe(
      shareReplay(1), // Cache the result for subsequent subscribers
      catchError((error) => {
        console.error('Error fetching product line items:', error);
        return throwError(() => error); // Re-throw the error for further handling
      })
    );
  }
}
