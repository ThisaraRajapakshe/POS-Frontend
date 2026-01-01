import { Component, computed, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, PosProduct } from '../../models';
import { CartService, InventoryService, OrderService } from '../../services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pos-pos-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos-sales.component.html',
  styleUrl: './pos-sales.component.scss'
})
export class PosSalesComponent implements OnInit {

  // Data Streams
  cartItems: Signal<CartItem[]>;
  cartTotal: Signal<number>;
  products: WritableSignal<PosProduct[]> = signal([]);
  quantity: number = 1;

  constructor(
    private cartService: CartService,
    private inventoryService: InventoryService,
    private orderService: OrderService
  ) {
    this.cartItems = this.cartService.items;
    this.cartTotal = computed(() => {
      const items = this.cartItems();
      return items.reduce((total, item) => total + item.subTotal, 0);
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.inventoryService.getProductsForPos().subscribe({
      next: (data) => {
        this.products.set(data);
      },
      error: (err) => {
        console.error("Failed to load products", err);
      }
    });
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
    this.orderService.createOrder(this.cartItems(), this.cartTotal()).subscribe({
      next: () => {
        alert("Order created successfully");
        this.loadProducts();
      },
      error: (err) => {
        console.error("Failed to create order", err);
      }
    });
    console.log("Checkout Clicked")
  }
}