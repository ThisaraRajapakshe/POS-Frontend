import { Component, computed, OnInit, Signal } from '@angular/core';
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
  cartItems: Signal<CartItem[]>;
  cartTotal: Signal<number>;
  products$!: Observable<PosProduct[]>;
  quantity: number = 1;

  constructor(private cartService: CartService, private inventoryService: InventoryService) {
    this.cartItems = this.cartService.items;
    this.cartTotal = computed(() => {
      const items = this.cartItems();
      return items.reduce((total, item) => total + item.subTotal, 0);
    });
  }

  ngOnInit(): void {
    this.products$ = this.inventoryService.getProductsForPos();
  }

  addToCart(product: PosProduct, quantity: number): { success: boolean, message?: string } {
    const result = this.cartService.addToCart(product, quantity);
    if (!result.success) {
      alert(result.message);
      this.quantity = 1;
    }
    return result;
  }

  removeFromCart(item: CartItem) {
    this.cartService.removeFromCart(item.lineItemId);
  }

  onCheckout() {
    console.log('Checkout clicked');
  }
}