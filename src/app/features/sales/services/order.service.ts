import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CartItem, OrderCreateRequestDto } from '../models';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private cartService = inject(CartService);


  private apiUrl = `${environment.apiUrl}/Orders`;

  createOrder(items: CartItem[], totalAmount: number) {
    if (!items || items.length === 0) {
      throw new Error('No items provided');
    }
    if (totalAmount <= 0) {
      throw new Error('Invalid total amount');
    }
    const payload = this.mapToOrderRequest(items, totalAmount);

    return this.http.post(this.apiUrl, payload).pipe(
      tap(() => this.cartService.clearCart()) // clear cart at end of a sale
    );
  }
  mapToOrderRequest(items: CartItem[], totalAmount: number): OrderCreateRequestDto {
    return {
      totalAmount: totalAmount,
      paymentMethod: 'Cash',
      isPending: false,
      orderItems: items.map(item => ({
        productLineItemId: item.lineItemId,
        salesPrice: item.price,
        quantity: item.quantity
      }))
    }
  }

  getOrders(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
