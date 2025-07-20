import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLineItemEditComponent } from './product-line-item-edit.component';

describe('ProductLineItemEditComponent', () => {
  let component: ProductLineItemEditComponent;
  let fixture: ComponentFixture<ProductLineItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLineItemEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLineItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
