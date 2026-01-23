import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ProductService } from './product.service';
import { environment } from '../../../../environments/environment';
import { Product } from '../models/product/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  // Dummy data for testing
  const mockProducts: Product[] = [
    { 
      id: '1', 
      name: 'Laptop', 
      price: 999,
      category: {
        id: 'electronics-123',
        name: 'Electronics'
      } 
    } as Product,
    { 
      id: '2', 
      name: 'Mouse', 
      price: 25,
      category: {
        id: 'electronics-123',
        name: 'Electronics'
      } 
    } as Product
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // 1. The Service under test
        ProductService,
        // 2. Modern HTTP Client setup
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    // Inject the service and the testing controller
    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getByCategory', () => {
    it('should make a GET request to the correct category URL', () => {
      const categoryId = 'electronics-123';
      
      // 1. Call the method
      service.getByCategory(categoryId).subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });

      // 2. Expect a request to the constructed URL
      // Note: We use environment.apiUrl directly to ensure it matches the service logic
      const req = httpTestingController.expectOne(`${environment.apiUrl}/product/category/${categoryId}`);
      
      expect(req.request.method).toBe('GET');

      // 3. Flush mock data
      req.flush(mockProducts);
    });

    it('should handle errors cleanly', () => {
      const categoryId = 'bad-cat';
      
      service.getByCategory(categoryId).subscribe({
        next: () => fail('Should have failed with an error'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.status).toBe(500);
        }
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/product/category/${categoryId}`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('products$ (Constructor Cache)', () => {
    it('should share the replay of the initial getAll() request (Caching)', () => {
      // The service constructor initialized this.products$ calling this.getAll()
      // getAll() (from BaseHttpService) likely calls ${environment.apiUrl}/Product
      
      // 1. First subscription
      service['products$'].subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });

      // 2. Second subscription - if shareReplay is working, this should NOT trigger a second HTTP call
      service['products$'].subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });

      // 3. Expect EXACTLY ONE request despite two subscriptions
      const req = httpTestingController.expectOne(`${environment.apiUrl}/Product`);
      expect(req.request.method).toBe('GET');

      // 4. Flush the result, which should notify both subscribers
      req.flush(mockProducts);
    });
  });
});