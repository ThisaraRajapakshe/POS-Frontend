import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProductLineItemService } from './product-line-item.service';
import { ProductLineItem } from '../models/line-item/product-line-item.model';
import { environment } from '../../../../environments/environment';
// We need to import Product to satisfy the interface, 
// assuming it exists at this path based on your provided code snippets.
import { Product } from '../models/product/product.model';

describe('ProductLineItemService', () => {
  let service: ProductLineItemService;
  let httpTestingController: HttpTestingController;

  // Mock Data Setup
  const mockProduct: Product = {
    id: 'prod-1',
    name: 'Test Product'
  } as Product; // Casting to Partial/Product to satisfy strict typing if Product has more fields

  const mockLineItems: ProductLineItem[] = [
    {
      id: 'li-1',
      barCodeId: '123456',
      productId: 'prod-1',
      cost: 100,
      displayPrice: 150,
      discountedPrice: 140,
      quantity: 10,
      product: mockProduct
    },
    {
      id: 'li-2',
      barCodeId: '789012',
      productId: 'prod-1',
      cost: 50,
      displayPrice: 80,
      discountedPrice: 80,
      quantity: 5,
      product: mockProduct
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductLineItemService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProductLineItemService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure no requests are left outstanding
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initialization (productLineItems$)', () => {
    it('should cache the getAll request using shareReplay(1)', () => {
      // Accessing private property using strict casting
      const privateAccess = service as unknown as { productLineItems$: Observable<ProductLineItem[]> };

      // 1. Subscribe First Time
      privateAccess.productLineItems$.subscribe((items: ProductLineItem[]) => {
        expect(items).toEqual(mockLineItems);
      });

      // 2. Subscribe Second Time
      privateAccess.productLineItems$.subscribe((items: ProductLineItem[]) => {
        expect(items).toEqual(mockLineItems);
      });

      // 3. Verify only ONE request was sent to the BaseHttpService URL
      const req = httpTestingController.expectOne(`${environment.apiUrl}/ProductLineItem`);
      expect(req.request.method).toBe('GET');

      // 4. Flush the mock data
      req.flush(mockLineItems);
    });

    it('should handle errors during initialization', () => {
      const privateAccess = service as unknown as { productLineItems$: Observable<ProductLineItem[]> };

      privateAccess.productLineItems$.subscribe({
        next: () => fail('Should have failed with an error'),
        error: (error: unknown) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/ProductLineItem`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getByProduct', () => {
    it('should fetch line items for a specific product', () => {
      const productId = 'prod-1';

      service.getByProduct(productId).subscribe((items: ProductLineItem[]) => {
        expect(items.length).toBe(2);
        expect(items).toEqual(mockLineItems);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/ProductLineItem/product/${productId}`);
      expect(req.request.method).toBe('GET');

      req.flush(mockLineItems);
    });

    it('should handle 404 error when fetching by product', () => {
      const productId = 'invalid-id';

      service.getByProduct(productId).subscribe({
        next: () => fail('Expected an error, not data'),
        error: (error: unknown) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/ProductLineItem/product/${productId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});