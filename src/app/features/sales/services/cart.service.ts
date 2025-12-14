import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.ui';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ProductLineItem } from '../../../Core/models/Domains/product-line-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() { }

  addToCart(product: ProductLineItem, quantity: number) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.productLineItemId === product.id);
    if (existingItem) {
      if (existingItem.quantity + quantity > product.quantity) {
        alert("Out of stock");
        return;
      }
      existingItem.quantity += quantity;
      existingItem.subTotal = existingItem.quantity * existingItem.price;
    } else {
      if (product.quantity < quantity) {
        alert("Out of stock");
        return;
      }
      const newItem: CartItem = {
        productLineItemId: product.id,
        productName: product.product.name,
        barcode: product.barCodeId,
        quantity: quantity,
        price: product.discountedPrice,
        subTotal: quantity * product.discountedPrice,
        maxStock: product.quantity
      };
      currentItems.push(newItem);
    }
    this.cartItems.next([...currentItems]);
  }
  removeFromCart(productId: string): boolean {
    const currentItems = this.cartItems.value;
    const itemIndex = currentItems.findIndex(item => item.productLineItemId === productId);
    if (itemIndex === -1) {
      console.warn("Item not found in cart");
      return false;
    }
    const updatedItems = currentItems.filter(item => item.productLineItemId !== productId);
    this.cartItems.next(updatedItems);
    return true;
  }
  clearCart(): void {
    this.cartItems.next([]);
  }
  getTotalAmount(): number {
    const currentItems = this.cartItems.value;
    return currentItems.reduce((total, item) => total + item.subTotal, 0);
  }
}
