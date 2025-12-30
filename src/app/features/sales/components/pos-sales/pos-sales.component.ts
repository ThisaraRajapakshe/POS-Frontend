import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- FIX 1: Needed for *ngFor, async, currency
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, PosProduct } from '../../models';
import { CartService, InventoryService } from '../../services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pos-pos-sales',
  standalone: true, // <--- You are using Standalone
  imports: [CommonModule, FormsModule], // <--- FIX 1: This unlocks the HTML errors
  templateUrl: './pos-sales.component.html',
  styleUrl: './pos-sales.component.scss'
})
export class PosSalesComponent implements OnInit {

  // Data Streams
  cartItems$: Observable<CartItem[]>;
  cartTotal$!: Observable<number>;
  products$!: Observable<PosProduct[]>;
  quantity: number = 1;

  constructor(private cartService: CartService, private inventoryService: InventoryService) {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartTotal$ = this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + item.subTotal, 0)));
  }

  ngOnInit(): void {
    this.products$ = this.inventoryService.getProductsForPos();
  }

  addToCart(product: PosProduct, quantity: number) {
    this.cartService.addToCart(product, quantity);
    this.quantity = 1;
  }

  removeFromCart(item: CartItem) {
    console.log('Remove not implemented yet', item);
  }

  onCheckout() {
    console.log('Checkout clicked');
  }
}