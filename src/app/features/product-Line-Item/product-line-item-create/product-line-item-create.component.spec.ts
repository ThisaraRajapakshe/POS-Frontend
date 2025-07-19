import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLineItemCreateComponent } from './product-line-item-create.component';

describe('ProductLineItemCreateComponent', () => {
  let component: ProductLineItemCreateComponent;
  let fixture: ComponentFixture<ProductLineItemCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLineItemCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLineItemCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
