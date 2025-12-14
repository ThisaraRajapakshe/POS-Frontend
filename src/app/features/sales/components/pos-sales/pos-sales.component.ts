import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- FIX 1: Needed for *ngFor, async, currency
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from '../../models';
import { CartService } from '../../services';

@Component({
  selector: 'pos-pos-sales',
  standalone: true, // <--- You are using Standalone
  imports: [CommonModule], // <--- FIX 1: This unlocks the HTML errors
  templateUrl: './pos-sales.component.html',
  styleUrl: './pos-sales.component.scss'
})
export class PosSalesComponent implements OnInit {

  // Data Streams
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;

  // Dummy Data
  products = [
    { productLineItemId: '1', name: 'Rice Packet', salesPrice: 450, quantity: 100 },
    { productLineItemId: '2', name: 'Coca Cola', salesPrice: 150, quantity: 100 },
    { productLineItemId: '3', name: 'Short Eats', salesPrice: 80, quantity: 50 },
  ];

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;

    // FIX 3: Calculate total dynamically from the stream
    this.cartTotal$ = this.cartItems$.pipe(
      map(items => items.reduce((acc, item) => acc + (item.price * item.quantity), 0))
    );
  }

  ngOnInit(): void {
  }

  addToCart(product: any) {
    // FIX 2: Call the service exactly as it is defined in your screenshot
    // Your service wants: (product, quantity)
    // We map your dummy product to the shape the service expects
    const productToSend = {
      productLineItemId: product.productLineItemId,
      name: product.name,
      salesPrice: product.salesPrice,
      quantity: product.quantity
      // Add other fields if your ProductLineItem model requires them
    };

    this.cartService.addToCart(productToSend as any, 1);
  }

  removeFromCart(item: CartItem) {
    console.log('Remove not implemented yet', item);
  }

  onCheckout() {
    console.log('Checkout clicked');
  }
}