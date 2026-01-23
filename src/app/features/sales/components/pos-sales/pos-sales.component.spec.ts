import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PosSalesComponent } from './pos-sales.component';
import { CartService, InventoryService, OrderService } from '../../services';
import { signal, WritableSignal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { CartItem, PosProduct, Order } from '../../models';
import { By } from '@angular/platform-browser';

// Define strict types for our mocks including the Signal properties
// This avoids using 'any' when accessing the .items property on the spy
type MockCartService = Omit<jasmine.SpyObj<CartService>, 'items'> & { items: WritableSignal<CartItem[]> };

describe('PosSalesComponent', () => {
  let component: PosSalesComponent;
  let fixture: ComponentFixture<PosSalesComponent>;

  // Spies
  let cartServiceSpy: MockCartService;
  let inventoryServiceSpy: jasmine.SpyObj<InventoryService>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;

  // Signals for controlling mock state
  let mockCartSignal: WritableSignal<CartItem[]>;

  // Mock Data
  const mockProduct: PosProduct = {
    lineItemId: 'p1',
    name: 'Test Product',
    barcode: '123',
    displayPrice: 100,
    salePrice: 90,
    stock: 20
  };

  const mockCartItem: CartItem = {
    lineItemId: 'p1',
    productName: 'Test Product',
    barcode: '123',
    quantity: 1,
    price: 90,
    subTotal: 90,
    maxStock: 20
  };

  beforeEach(async () => {
    // 1. Initialize Signals
    mockCartSignal = signal([mockCartItem]);

    // 2. Create Spies
    // Note: We cast to unknown first, then to our specific Mock type to attach the property safely
    const cartSpy = jasmine.createSpyObj('CartService', [
      'addToCart',
      'removeFromCart',
      'UpdateQuantity'
    ]) as unknown as MockCartService;
    
    // Assign the signal to the property expected by the component
    cartSpy.items = mockCartSignal;
    cartServiceSpy = cartSpy;

    inventoryServiceSpy = jasmine.createSpyObj('InventoryService', ['getProductsForPos']);
    orderServiceSpy = jasmine.createSpyObj('OrderService', ['createOrder']);

    // 3. Initialize Spy Returns (Default Happy Path)
    inventoryServiceSpy.getProductsForPos.and.returnValue(of([mockProduct]));
    
    // Default success for add to cart
    cartServiceSpy.addToCart.and.returnValue({ success: true });

    // 4. Configure TestBed
    await TestBed.configureTestingModule({
      imports: [PosSalesComponent], // Standalone component
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: InventoryService, useValue: inventoryServiceSpy },
        { provide: OrderService, useValue: orderServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PosSalesComponent);
    component = fixture.componentInstance;
    
    // Spy on window.alert to prevent blocking and verify alerts
    spyOn(window, 'alert');

    // Trigger ngOnInit
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- INITIALIZATION TESTS ---

  it('should load products on initialization', () => {
    expect(inventoryServiceSpy.getProductsForPos).toHaveBeenCalled();
    expect(component.products().length).toBe(1);
    expect(component.products()[0]).toEqual(mockProduct);
  });

  it('should initialize cart totals from the service signal', () => {
    // Check computed signal logic
    expect(component.cartItems().length).toBe(1);
    expect(component.cartTotal()).toBe(90); // 1 item * 90 subtotal
  });

  it('should handle product loading error gracefully', () => {
    // Suppress console.error for this specific expected error test
    spyOn(console, 'error');
    
    // Reset component to test Init again with error
    inventoryServiceSpy.getProductsForPos.and.returnValue(throwError(() => new Error('API Fail')));
    
    component.ngOnInit(); // Re-run init manually
    
    expect(console.error).toHaveBeenCalledWith('Failed to load products', jasmine.any(Error));
  });

  // --- CART ACTION TESTS ---

  it('should add product to cart successfully', () => {
    component.addToCart(mockProduct, 1);
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(mockProduct, 1);
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('should alert and reset quantity if adding to cart fails', () => {
    // Arrange: Mock failure
    cartServiceSpy.addToCart.and.returnValue({ success: false, message: 'Stock Low' });
    component.quantity = 5; // User typed 5

    // Act
    component.addToCart(mockProduct, 5);

    // Assert
    expect(window.alert).toHaveBeenCalledWith('Stock Low');
    expect(component.quantity).toBe(1); // Should reset to 1
  });

  it('should call removeFromCart on service', () => {
    component.removeFromCart(mockCartItem);
    expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith(mockCartItem.lineItemId);
  });

  it('should update quantity via service', () => {
    const newQty = 5;
    component.updateQuantity(mockCartItem, newQty);
    expect(cartServiceSpy.UpdateQuantity).toHaveBeenCalledWith(mockCartItem.lineItemId, newQty);
  });

  it('should NOT update quantity if value is invalid', () => {
    component.updateQuantity(mockCartItem, 0); // Invalid < 1
    expect(cartServiceSpy.UpdateQuantity).not.toHaveBeenCalled();

    component.updateQuantity(mockCartItem, null as unknown as number); // Invalid null
    expect(cartServiceSpy.UpdateQuantity).not.toHaveBeenCalled();
  });

  // --- CHECKOUT TESTS ---

  it('should process checkout successfully', () => {
    // Arrange
    const mockOrder = {} as Order;
    orderServiceSpy.createOrder.and.returnValue(of(mockOrder));
    // Reset calls to product load to ensure we check the *reload*
    inventoryServiceSpy.getProductsForPos.calls.reset();

    // Act
    component.onCheckout();

    // Assert
    expect(orderServiceSpy.createOrder).toHaveBeenCalledWith(component.cartItems(), component.cartTotal());
    expect(window.alert).toHaveBeenCalledWith('Order created successfully');
    // Ensure products are reloaded to update stock levels
    expect(inventoryServiceSpy.getProductsForPos).toHaveBeenCalled();
  });

  it('should handle checkout errors', () => {
    // Arrange
    spyOn(console, 'error');
    orderServiceSpy.createOrder.and.returnValue(throwError(() => new Error('Order Failed')));

    // Act
    component.onCheckout();

    // Assert
    expect(console.error).toHaveBeenCalledWith('Failed to create order', jasmine.any(Error));
    // Should NOT show success alert
    expect(window.alert).not.toHaveBeenCalledWith('Order created successfully');
  });

  // --- TEMPLATE RENDERING TESTS ---

  it('should render product list', () => {
    const productElements = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productElements.length).toBe(1);
    expect(productElements[0].nativeElement.textContent).toContain(mockProduct.name);
  });

  it('should render cart items', () => {
    const cartElements = fixture.debugElement.queryAll(By.css('.cart-row'));
    expect(cartElements.length).toBe(1);
    expect(cartElements[0].nativeElement.textContent).toContain(mockCartItem.productName);
  });
});