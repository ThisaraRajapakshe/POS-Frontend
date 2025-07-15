import { TestBed } from '@angular/core/testing';

import { ProductLineItemService } from './product-line-item.service';

describe('ProductLineItemService', () => {
  let service: ProductLineItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductLineItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
