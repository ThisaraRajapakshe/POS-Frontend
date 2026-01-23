import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CategoryService } from './category.service';
import { Category } from '../models/category/category.model';
import { UpdateCategoryDto } from '../models/category/update-category-dto';
import { environment } from '../../../../environments/environment';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpTestingController: HttpTestingController;

  const mockCategories: Category[] = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Books' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CategoryService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initialization (categories$)', () => {
    it('should cache the getAll() request using shareReplay(1)', () => {
      // Accessing the private property 'categories$' using the required casting method
      const privateAccess = service as unknown as { categories$: Observable<Category[]> };
      
      // 1. First subscription
      privateAccess.categories$.subscribe((categories: Category[]) => {
        expect(categories).toEqual(mockCategories);
      });

      // 2. Second subscription (should not trigger a new HTTP call)
      privateAccess.categories$.subscribe((categories: Category[]) => {
        expect(categories).toEqual(mockCategories);
      });

      // 3. Verify only ONE request was made despite two subscriptions
      const req = httpTestingController.expectOne(`${environment.apiUrl}/Category`);
      expect(req.request.method).toBe('GET');

      // 4. Flush data to trigger subscribers
      req.flush(mockCategories);
    });

    it('should handle errors in the cached observable', () => {
      const privateAccess = service as unknown as { categories$: Observable<Category[]> };

      privateAccess.categories$.subscribe({
        next: () => fail('Should have failed with 500 error'),
        error: (error: unknown) => {
          // Verify the error object is propagated
          expect(error).toBeTruthy();
        }
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/Category`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('Inherited Methods', () => {
    // Testing that the BaseHttpService logic was correctly initialized with the Category endpoint
    it('should send an UPDATE request to the correct URL', () => {
      const updateDto: UpdateCategoryDto = { name: 'Updated Electronics' };
      const categoryId = '1';
      const updatedCategory: Category = { id: '1', name: 'Updated Electronics' };

      // Assuming BaseHttpService has an update method with signature update(id, dto)
      service.update(categoryId, updateDto).subscribe((response: Category) => {
        expect(response).toEqual(updatedCategory);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/Category/${categoryId}`);
      
      // BaseHttpService usually uses PUT for updates, checking method to be safe
      // Adjust to 'PATCH' if your BaseHttpService uses PATCH
      expect(req.request.method).toMatch(/PUT|PATCH/); 
      expect(req.request.body).toEqual(updateDto);

      req.flush(updatedCategory);
    });
  });
});