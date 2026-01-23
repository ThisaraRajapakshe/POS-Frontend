import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BaseHttpService } from './base-http.service';

// --- 1. Define Strict Interfaces for Testing ---
interface TestEntity {
  id: string;
  name: string;
}

interface TestCreateDto {
  name: string;
}

interface TestUpdateDto {
  name: string;
  active: boolean;
}

// --- 2. Create Concrete Implementation for Testing ---
// We extend the BaseHttpService to test its logic.
// We use 'inject()' inside the constructor to satisfy Angular 19 modern patterns.
@Injectable()
class ConcreteTestService extends BaseHttpService<TestEntity, TestCreateDto, TestUpdateDto> {
  constructor() {
    // Angular 19+ pattern: resolving dependency via inject() for the super call
    super(inject(HttpClient), 'https://api.example.com/items');
  }
}

describe('BaseHttpService', () => {
  let service: ConcreteTestService;
  let httpTestingController: HttpTestingController;
  const baseUrl = 'https://api.example.com/items';

  const mockEntities: TestEntity[] = [
    { id: '1', name: 'Item One' },
    { id: '2', name: 'Item Two' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConcreteTestService,
        // Angular 19 / Modern Provider Setup
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ConcreteTestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should send a GET request to the base URL', () => {
      service.getAll().subscribe((items: TestEntity[]) => {
        expect(items.length).toBe(2);
        expect(items).toEqual(mockEntities);
      });

      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockEntities);
    });
  });

  describe('getById', () => {
    it('should send a GET request to the correct URL with ID', () => {
      const id = '123';
      const mockEntity: TestEntity = { id: '123', name: 'Target Item' };

      service.getById(id).subscribe((item: TestEntity) => {
        expect(item).toEqual(mockEntity);
      });

      const req = httpTestingController.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEntity);
    });
  });

  describe('create', () => {
    it('should send a POST request with the DTO', () => {
      const createDto: TestCreateDto = { name: 'New Item' };
      const responseEntity: TestEntity = { id: '999', name: 'New Item' };

      service.create(createDto).subscribe((item: TestEntity) => {
        expect(item).toEqual(responseEntity);
      });

      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createDto);
      req.flush(responseEntity);
    });
  });

  describe('update', () => {
    it('should send a PUT request to the correct URL with ID and DTO', () => {
      const id = '555';
      const updateDto: TestUpdateDto = { name: 'Updated Name', active: true };
      const responseEntity: TestEntity = { id: '555', name: 'Updated Name' };

      service.update(id, updateDto).subscribe((item: TestEntity) => {
        expect(item).toEqual(responseEntity);
      });

      const req = httpTestingController.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateDto);
      req.flush(responseEntity);
    });
  });

  describe('delete', () => {
    it('should send a DELETE request to the correct URL with ID', () => {
      const id = '888';

      service.delete(id).subscribe({
        next: () => {
           // Success callback verification if needed
           expect(true).toBeTrue();
        }
      });

      const req = httpTestingController.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null); // DELETE usually returns empty body or null
    });
  });
});