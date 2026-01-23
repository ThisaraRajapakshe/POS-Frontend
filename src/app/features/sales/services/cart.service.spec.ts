import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CartService } from './cart.service';
import { PosProduct, CartItem } from '../models'; // Adjust path as needed

describe('CartService', () => {
  let service: CartService;

  // Mock Data Setup
  const mockProduct1: PosProduct = {
    lineItemId: 'prod-1',
    name: 'Wireless Mouse',
    barcode: '111111',
    displayPrice: 30,
    salePrice: 25,
    stock: 10
  };

  const mockProduct2: PosProduct = {
    lineItemId: 'prod-2',
    name: 'Keyboard',
    barcode: '222222',
    displayPrice: 100,
    salePrice: 100,
    stock: 5
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartService,
        // Included as per requirements, even though this service is local-state only
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addToCart', () => {
    it('should add a new item to the cart', () => {
      // Act
      const result = service.addToCart(mockProduct1, 2);

      // Assert Response
      expect(result.success).toBeTrue();
      expect(result.message).toBeUndefined();

      // Assert State
      const items = service.items();
      expect(items.length).toBe(1);
      
      const addedItem: CartItem = items[0];
      expect(addedItem.lineItemId).toBe(mockProduct1.lineItemId);
      expect(addedItem.quantity).toBe(2);
      expect(addedItem.subTotal).toBe(50); // 2 * 25
    });

    it('should increment quantity if item already exists', () => {
      // Arrange
      service.addToCart(mockProduct1, 2);

      // Act
      const result = service.addToCart(mockProduct1, 3);

      // Assert
      expect(result.success).toBeTrue();
      
      const items = service.items();
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(5); // 2 + 3
      expect(items[0].subTotal).toBe(125); // 5 * 25
    });

    it('should return failure if adding new item exceeds stock', () => {
      // Act: Try to add 11 (Stock is 10)
      const result = service.addToCart(mockProduct1, 11);

      // Assert
      expect(result.success).toBeFalse();
      expect(result.message).toBe('Not enough stock!');
      expect(service.items().length).toBe(0);
    });

    it('should return failure if incrementing existing item exceeds stock', () => {
      // Arrange: Add 8 items (Stock 10)
      service.addToCart(mockProduct1, 8);

      // Act: Try to add 3 more (Total would be 11)
      const result = service.addToCart(mockProduct1, 3);

      // Assert
      expect(result.success).toBeFalse();
      expect(result.message).toBe('Not enough stock!');
      
      // Ensure state rolled back/remained unchanged
      const items = service.items();
      expect(items[0].quantity).toBe(8);
    });
  });

  describe('UpdateQuantity', () => {
    beforeEach(() => {
      service.addToCart(mockProduct1, 5); // Start with 5 items
    });

    it('should update quantity and subtotal successfully', () => {
      // Act
      service.UpdateQuantity('prod-1', 8);

      // Assert
      const item = service.items()[0];
      expect(item.quantity).toBe(8);
      expect(item.subTotal).toBe(200); // 8 * 25
    });

    it('should ignore update if new quantity exceeds maxStock', () => {
      // Act: Try to update to 11 (Stock 10)
      service.UpdateQuantity('prod-1', 11);

      // Assert: Should stay at 5
      const item = service.items()[0];
      expect(item.quantity).toBe(5);
    });

    it('should ignore update if new quantity is negative', () => {
      // Act
      service.UpdateQuantity('prod-1', -1);

      // Assert
      const item = service.items()[0];
      expect(item.quantity).toBe(5);
    });

    it('should do nothing if lineItemId is not found', () => {
      // Act
      service.UpdateQuantity('unknown-id', 5);

      // Assert
      expect(service.items().length).toBe(1);
      expect(service.items()[0].quantity).toBe(5);
    });
  });

  describe('removeFromCart', () => {
    it('should remove the specific item from the list', () => {
      // Arrange
      service.addToCart(mockProduct1, 1);
      service.addToCart(mockProduct2, 1);
      expect(service.items().length).toBe(2);

      // Act
      service.removeFromCart('prod-1');

      // Assert
      const items = service.items();
      expect(items.length).toBe(1);
      expect(items[0].lineItemId).toBe('prod-2');
    });
  });

  describe('clearCart', () => {
    it('should remove all items', () => {
      // Arrange
      service.addToCart(mockProduct1, 1);
      
      // Act
      service.clearCart();

      // Assert
      expect(service.items().length).toBe(0);
    });
  });

  describe('Computed Signals', () => {
    it('should correctly calculate totalCount', () => {
      service.addToCart(mockProduct1, 2);
      service.addToCart(mockProduct2, 3);

      expect(service.totalCount()).toBe(5); // 2 + 3
    });

    it('should correctly calculate totalAmount', () => {
      // Product 1: 2 * 25 = 50
      service.addToCart(mockProduct1, 2);
      // Product 2: 3 * 100 = 300
      service.addToCart(mockProduct2, 3);

      expect(service.totalAmount()).toBe(350); // 50 + 300
    });

    it('should return 0 for totals when cart is empty', () => {
      service.clearCart();
      expect(service.totalCount()).toBe(0);
      expect(service.totalAmount()).toBe(0);
    });
  });
});