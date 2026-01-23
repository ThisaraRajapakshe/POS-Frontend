import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { OrderService } from './order.service';
import { CartService } from './cart.service';
import { OrderMapper } from '../mappers/order.mapper'; // Assumed path based on imports
import { environment } from '../../../../environments/environment';

// Interfaces
import { CartItem, Order, OrderResponseDto, OrderCreateRequestDto, OrderStatus } from '../models';

describe('OrderService', () => {
  let service: OrderService;
  let httpTestingController: HttpTestingController;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  const mockApiUrl = `${environment.apiUrl}/Orders`;

  // --- Mock Data ---
  const mockCartItems: CartItem[] = [
    {
      lineItemId: 'prod-1',
      productName: 'Widget A',
      barcode: '123',
      quantity: 2,
      price: 10,
      subTotal: 20,
      maxStock: 100
    }
  ];

  const mockOrderResponseDto: OrderResponseDto = {
    id: 'order-123',
    orderNumber: 'ORD-001',
    orderDate: '2023-10-01T10:00:00Z',
    totalAmount: 20,
    status: 'Completed',
    orderItems: [
      {
        productName: 'Widget A',
        salesPrice: 10,
        quantity: 2
      }
    ]
  };

  const mockOrder: Order = OrderMapper.fromDto(mockOrderResponseDto);

  beforeEach(() => {
    // Mock the dependency CartService
    cartServiceSpy = jasmine.createSpyObj('CartService', ['clearCart']);

    TestBed.configureTestingModule({
      providers: [
        OrderService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CartService, useValue: cartServiceSpy }
      ]
    });

    service = TestBed.inject(OrderService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createOrder', () => {
    it('should validate validation logic: throws error if items array is empty', () => {
      service.createOrder([], 100).subscribe({
        next: () => fail('Should have failed'),
        error: (err: Error) => {
          expect(err.message).toBe('No items provided');
        }
      });
    });

    it('should validate validation logic: throws error if totalAmount is invalid', () => {
      service.createOrder(mockCartItems, 0).subscribe({
        next: () => fail('Should have failed'),
        error: (err: Error) => {
          expect(err.message).toBe('Invalid total amount');
        }
      });
    });

    it('should POST to API, return mapped Order, and clear cart', () => {
      const totalAmount = 20;

      // Act
      service.createOrder(mockCartItems, totalAmount).subscribe((order: Order) => {
        // Assert Mapped Result
        expect(order).toEqual(mockOrder);
        expect(order.status).toBe(OrderStatus.Completed);
        expect(order.items.length).toBe(1);
      });

      // Assert HTTP Request
      const req = httpTestingController.expectOne(mockApiUrl);
      expect(req.request.method).toBe('POST');
      
      // Verify Payload Structure (Logic: mapToOrderRequest)
      const expectedPayload: OrderCreateRequestDto = {
        totalAmount: 20,
        paymentMethod: 'Cash',
        isPending: false,
        orderItems: [
          { productLineItemId: 'prod-1', salesPrice: 10, quantity: 2 }
        ]
      };
      expect(req.request.body).toEqual(expectedPayload);

      // Flush Response
      req.flush(mockOrderResponseDto);

      // Assert Side Effect: Cart cleared
      expect(cartServiceSpy.clearCart).toHaveBeenCalled();
    });
  });

  describe('getOrders', () => {
    it('should GET all orders and map them', () => {
      const mockResponseList: OrderResponseDto[] = [mockOrderResponseDto];
      const mockMappedList: Order[] = [mockOrder];

      service.getOrders().subscribe((orders: Order[]) => {
        expect(orders.length).toBe(1);
        expect(orders).toEqual(mockMappedList);
        expect(orders[0].orderDate).toBeInstanceOf(Date);
      });

      const req = httpTestingController.expectOne(mockApiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponseList);
    });
  });

  describe('getOrderById', () => {
    it('should GET order by ID and map result', () => {
      const id = 'order-123';

      service.getOrderById(id).subscribe((order: Order) => {
        expect(order).toEqual(mockOrder);
        expect(order.id).toBe(id);
      });

      const req = httpTestingController.expectOne(`${mockApiUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockOrderResponseDto);
    });
  });
});