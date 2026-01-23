import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineItemListComponent } from './line-item-list.component';
import { ProductLineItemService } from '../../../../../services';
import { ProductLineItem } from '../../../../../models';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('LineItemListComponent', () => {
  let component: LineItemListComponent;
  let fixture: ComponentFixture<LineItemListComponent>;
  let lineItemServiceSpy: jasmine.SpyObj<ProductLineItemService>;

  // Mock Data matching the template's nested access requirements
  const mockLineItems: ProductLineItem[] = [
    {
      id: 'li-1',
      barCodeId: '888',
      cost: 100,
      displayPrice: 150,
      discountedPrice: 140,
      quantity: 10,
      productId: 'prod-1',
      // Nested object structure required by template: item.product.category.name
      product: {
        id: 'prod-1',
        name: 'Test Product',
        category: {
          id: 'cat-1',
          name: 'Test Category'
        }
      }
    }
  ];

  beforeEach(async () => {
    // 1. Create strict SpyObj
    lineItemServiceSpy = jasmine.createSpyObj<ProductLineItemService>('ProductLineItemService', ['getByProduct']);

    await TestBed.configureTestingModule({
      imports: [
        LineItemListComponent,
        NoopAnimationsModule // Prevent animation-related errors
      ],
      providers: [
        { provide: ProductLineItemService, useValue: lineItemServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LineItemListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should fetch line items when productId input is set', () => {
      // Arrange
      const productId = 'prod-1';
      component.productId = productId;
      lineItemServiceSpy.getByProduct.and.returnValue(of(mockLineItems));

      // Act
      component.ngOnChanges();
      fixture.detectChanges(); // Trigger Async Pipe and Template Rendering

      // Assert Logic
      expect(lineItemServiceSpy.getByProduct).toHaveBeenCalledWith(productId);

      // Assert Template (Mat Table)
      const tableRows = fixture.debugElement.queryAll(By.css('tr[mat-row]'));
      expect(tableRows.length).toBe(1);

      // Verify cell content (e.g., Product Name)
      const rowText = tableRows[0].nativeElement.textContent;
      expect(rowText).toContain('Test Product'); // item.product.name
      expect(rowText).toContain('Test Category'); // item.product.category.name
      expect(rowText).toContain('888'); // item.barCodeId
    });

    it('should NOT fetch data if productId is missing', () => {
      // Act
      component.ngOnChanges(); // productId is undefined

      // Assert
      expect(lineItemServiceSpy.getByProduct).not.toHaveBeenCalled();
    });
  });
});