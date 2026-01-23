import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ProductLineItemDto } from '../../catalog/models';
import { PosProduct } from '../models';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);


  getProductsForPos() {
    return this.http.get<ProductLineItemDto[]>(`${environment.apiUrl}/ProductLineItem`).pipe(
      map((items: ProductLineItemDto[]) => items.map(this.MaptoPosProduct))
    );
  }
  // helper function
  private MaptoPosProduct(item: ProductLineItemDto): PosProduct {
    return {
      lineItemId: item.id,
      name: item.product.name,
      barcode: item.barCodeId,
      displayPrice: item.displayPrice,
      salePrice: item.discountedPrice,
      stock: item.quantity
    }
  }
}
