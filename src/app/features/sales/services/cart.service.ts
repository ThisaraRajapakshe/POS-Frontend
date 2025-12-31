import { computed, Injectable, signal } from '@angular/core';
import { CartItem, PosProduct } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly items = signal<CartItem[]>([]);
  readonly totalAmount = computed(() =>
    this.items().reduce((total, item) => total + item.subTotal, 0));
  readonly totalCount = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0));


  //Add to cart function
  addToCart(product: PosProduct, quantity: number): { success: boolean, message?: string } {
    const currentItems = this.items();
    const existingItem = currentItems.find(i => i.lineItemId === product.lineItemId);

    // Stock Check for New Items
    if (!existingItem && quantity > product.stock) {
      return { success: false, message: 'Not enough stock!' };
    }

    // Stock Check for Existing Items
    if (existingItem && (existingItem.quantity + quantity > product.stock)) {
      return { success: false, message: 'Not enough stock!' };
    }

    // STATE UPDATE (Immutable)
    this.items.update(items => {
      // If item exists, map through and update ONLY that specific item
      if (existingItem) {
        return items.map(item =>
          item.lineItemId === product.lineItemId
            ? {
              ...item,
              quantity: item.quantity + quantity,
              subTotal: (item.quantity + quantity) * item.price
            }
            : item

        );
      } else {
        // If item is a new item, add it to the array
        const newItem: CartItem = {
          lineItemId: product.lineItemId,
          productName: product.name,
          barcode: product.barcode,
          quantity: quantity,
          price: product.salePrice,
          subTotal: quantity * product.salePrice,
          maxStock: product.stock
        };
        return [...items, newItem];
      }
    });
    return { success: true };
  }

  // Remove from cart function
  removeFromCart(lineItemId: string) {
    this.items.update(items => items.filter(i => i.lineItemId !== lineItemId));
  }
  // Clear cart function
  clearCart(): void {
    this.items.set([]);
  }
}
