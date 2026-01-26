import { Component, computed, OnInit, signal, Signal, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, Order, PosProduct } from '../../models';
import { CartService, InventoryService, OrderService } from '../../services';
import { FormsModule } from '@angular/forms';
import { ReceiptComponent } from "../receipt/receipt.component";
import { SearchBarComponent } from '../../../../shared/Components/search-bar/search-bar.component';
import { filterData } from '../../../../shared/utils/search-helper';

@Component({
  selector: 'pos-pos-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, ReceiptComponent, SearchBarComponent],
  templateUrl: './pos-sales.component.html',
  styleUrl: './pos-sales.component.scss'
})
export class PosSalesComponent implements OnInit {
  private cartService = inject(CartService);
  private inventoryService = inject(InventoryService);
  private orderService = inject(OrderService);


  // Data Streams
  cartItems: Signal<CartItem[]>;
  cartTotal: Signal<number>;
  products: WritableSignal<PosProduct[]> = signal([]);
  private allProducts: PosProduct[] = [];
  quantity = 1;
  lastCompletedOrder: WritableSignal<Order | null> = signal(null);

  constructor() {
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
        this.allProducts = data;
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
      next: (createOrder: Order) => {
        this.lastCompletedOrder.set(createOrder);
        alert("Order created successfully");
        this.loadProducts();

        setTimeout(() => {
            window.print();
        }, 300);
      },
      error: (err) => {
        console.error("Failed to create order", err);
      }
    });
    console.log("Checkout Clicked")
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    if (!newQuantity || newQuantity < 1) return;
    this.cartService.UpdateQuantity(item.lineItemId, newQuantity);
  }

  onSearchProducts(searchTerm: string){
    const filteredProducts = filterData(searchTerm, this.allProducts, ['name', 'barcode']);
    this.products.set(filteredProducts);
  }

}