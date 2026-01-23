import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../../services';
import { Product } from '../../../../models';
import { of } from 'rxjs';
import { Component, Input } from '@angular/core';
import { LineItemListComponent } from './line-item-list/line-item-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

// 1. Mock the Child Component
// This prevents errors arising from the child's own dependencies (like LineItemService)
@Component({
  selector: 'pos-line-item-list',
  standalone: true,
  template: ''
})
class MockLineItemListComponent {
  @Input() productId!: string;
}

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  // Mock Data
  const mockProducts: Product[] = [
    { id: 'prod-1', name: 'Coffee', category: { id: 'cat-1', name: 'Drinks' } },
    { id: 'prod-2', name: 'Tea', category: { id: 'cat-1', name: 'Drinks' } }
  ];

  beforeEach(async () => {
    // 2. Create Service Spy with strict typing
    productServiceSpy = jasmine.createSpyObj<ProductService>('ProductService', ['getByCategory']);

    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        // Material Components require an animation module
        NoopAnimationsModule 
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy }
      ]
    })
    // 3. Override Component to use Mock Child instead of Real Child
    .overrideComponent(ProductListComponent, {
      remove: { imports: [LineItemListComponent] },
      add: { imports: [MockLineItemListComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // Basic creation check
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges (Data Loading)', () => {
    it('should fetch products when categoryId input changes', () => {
      // Arrange
      const categoryId = 'cat-1';
      component.categoryId = categoryId;
      productServiceSpy.getByCategory.and.returnValue(of(mockProducts));

      // Act
      component.ngOnChanges();
      fixture.detectChanges(); // Trigger Async Pipe

      // Assert Logic
      expect(productServiceSpy.getByCategory).toHaveBeenCalledWith(categoryId);

      // Assert Template Rendering (Async Pipe)
      const panels = fixture.debugElement.queryAll(By.css('mat-expansion-panel'));
      expect(panels.length).toBe(2);
      expect(panels[0].nativeElement.textContent).toContain('Coffee');
    });

    it('should NOT fetch products if categoryId is missing', () => {
      // Arrange
      // component.categoryId is undefined by default
      
      // Act
      component.ngOnChanges();

      // Assert
      expect(productServiceSpy.getByCategory).not.toHaveBeenCalled();
    });
  });

  describe('User Interaction', () => {
    it('should emit productSelected event', () => {
      // Arrange
      const productId = 'prod-1';
      const emitSpy = spyOn(component.productSelected, 'emit');

      // Act
      component.selectProduct(productId);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(productId);
    });
  });
});