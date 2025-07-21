import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLineItemDeleteComponent } from './product-line-item-delete.component';

describe('ProductLineItemDeleteComponent', () => {
  let component: ProductLineItemDeleteComponent;
  let fixture: ComponentFixture<ProductLineItemDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLineItemDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLineItemDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
