import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap, throwError } from 'rxjs';
import { CartItem, Order, OrderCreateRequestDto, OrderResponseDto } from '../models';
import { CartService } from './cart.service';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private cartService = inject(CartService);


  private apiUrl = `${environment.apiUrl}/Orders`;

  createOrder(items: CartItem[], totalAmount: number): Observable<Order> {
    if (!items || items.length === 0) {
      // throw new Error('No items provided');
      return throwError(() => new Error('No items provided'));
    }
    if (totalAmount <= 0) {
      return throwError(() => new Error('Invalid total amount'));
    }
    const payload: OrderCreateRequestDto = OrderMapper.mapToOrderRequest(items,totalAmount);

    return this.http.post<OrderResponseDto>(this.apiUrl, payload).pipe(
      tap(() => this.cartService.clearCart()), // clear cart at end of a sale
      map((dto: OrderResponseDto) => OrderMapper.fromDto(dto))
    );
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<OrderResponseDto[]>(this.apiUrl).pipe(
      map((dtos: OrderResponseDto[]) => dtos.map(dto => OrderMapper.fromDto(dto)))
    );
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<OrderResponseDto>(`${this.apiUrl}/${id}`).pipe(
      map((dto: OrderResponseDto) => OrderMapper.fromDto(dto))
    ) ;
  }
}
