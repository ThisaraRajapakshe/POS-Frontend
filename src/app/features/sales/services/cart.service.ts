import { Injectable } from '@angular/core';
import { CartItem, PosProduct } from '../models';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() { }

  addToCart(product: PosProduct, quantity: number) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.lineItemId === product.lineItemId);
    if (existingItem) {
      if (existingItem.quantity + quantity > product.stock) {
        alert("Out of stock");
        return;
      }
      existingItem.quantity += quantity;
      existingItem.subTotal = existingItem.quantity * existingItem.price;
    } else {
      if (product.stock < quantity) {
        alert("Out of stock");
        return;
      }
      const newItem: CartItem = {
        lineItemId: product.lineItemId,
        productName: product.name,
        barcode: product.barcode,
        quantity: quantity,
        price: product.salePrice,
        subTotal: quantity * product.salePrice,
        maxStock: product.stock
      };
      currentItems.push(newItem);
    }
    this.cartItems.next([...currentItems]);
  }
  removeFromCart(productId: string): boolean {
    const currentItems = this.cartItems.value;
    const itemIndex = currentItems.findIndex(item => item.lineItemId === productId);
    if (itemIndex === -1) {
      console.warn("Item not found in cart");
      return false;
    }
    const updatedItems = currentItems.filter(item => item.lineItemId !== productId);
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
