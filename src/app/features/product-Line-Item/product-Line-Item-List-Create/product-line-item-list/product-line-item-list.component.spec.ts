import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLineItemListComponent } from './product-line-item-list.component';

describe('ProductLineItemListComponent', () => {
  let component: ProductLineItemListComponent;
  let fixture: ComponentFixture<ProductLineItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLineItemListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLineItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
