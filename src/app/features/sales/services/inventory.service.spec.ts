import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { InventoryService } from './inventory.service';
import { PosProduct } from '../models'; // Adjust path if necessary
import { environment } from '../../../../environments/environment';

// --- Interface Definition for Testing ---
// Defined locally to satisfy strict typing rules since it wasn't provided in the prompt,
// but is required by the Service's return type signature.
export interface ProductLineItemDto {
  id: string;
  barCodeId: string;
  quantity: number;
  displayPrice: number;
  discountedPrice: number;
  product: {
    name: string;
  };
}

describe('InventoryService', () => {
  let service: InventoryService;
  let httpTestingController: HttpTestingController;

  const mockApiUrl = `${environment.apiUrl}/ProductLineItem`;

  // Mock Data: Raw API Response
  const mockLineItems: ProductLineItemDto[] = [
    {
      id: 'li-1',
      barCodeId: '888888',
      quantity: 50,
      displayPrice: 10.00,
      discountedPrice: 9.50,
      product: {
        name: 'Green Tea'
      }
    },
    {
      id: 'li-2',
      barCodeId: '999999',
      quantity: 0,
      displayPrice: 5.00,
      discountedPrice: 5.00,
      product: {
        name: 'Black Coffee'
      }
    }
  ];

  // Mock Data: Expected Transformed Result
  const expectedPosProducts: PosProduct[] = [
    {
      lineItemId: 'li-1',
      name: 'Green Tea',
      barcode: '888888',
      displayPrice: 10.00,
      salePrice: 9.50,
      stock: 50
    },
    {
      lineItemId: 'li-2',
      name: 'Black Coffee',
      barcode: '999999',
      displayPrice: 5.00,
      salePrice: 5.00,
      stock: 0
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InventoryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(InventoryService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProductsForPos', () => {
    it('should fetch data from API and map it to PosProduct format', () => {
      // Act
      service.getProductsForPos().subscribe((products: PosProduct[]) => {
        // Assert: Verify length and deep equality of mapped objects
        expect(products.length).toBe(2);
        expect(products).toEqual(expectedPosProducts);
        
        // Granular check to prove mapping logic (Private helper MaptoPosProduct) worked
        expect(products[0].name).toBe('Green Tea');
        expect(products[0].stock).toBe(50);
      });

      // Assert: Verify HTTP Request
      const req = httpTestingController.expectOne(mockApiUrl);
      expect(req.request.method).toBe('GET');

      // Flush response to trigger subscription
      req.flush(mockLineItems);
    });

    it('should handle empty arrays correctly', () => {
      // Act
      service.getProductsForPos().subscribe((products: PosProduct[]) => {
        expect(products.length).toBe(0);
        expect(products).toEqual([]);
      });

      const req = httpTestingController.expectOne(mockApiUrl);
      req.flush([]);
    });

    it('should handle HTTP errors', () => {
      // Act
      service.getProductsForPos().subscribe({
        next: () => fail('Should have failed with error'),
        error: (error: unknown) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpTestingController.expectOne(mockApiUrl);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});