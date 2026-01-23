import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogComponent } from './catalog.component';
import { Component, EventEmitter, Output } from '@angular/core';
import { CategoryListComponent } from './category-list/category-list.component';
import { By } from '@angular/platform-browser';

// 1. Create a Mock Child Component
// This prevents us from needing to provide dependencies for the real CategoryListComponent
@Component({
  selector: 'pos-category-list',
  standalone: true,
  template: '<div>Mock Category List</div>'
})
class MockCategoryListComponent {
  @Output() categorySelected = new EventEmitter<string>();
}

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogComponent]
    })
    // 2. Override the component imports to swap the Real child with the Mock child
    .overrideComponent(CatalogComponent, {
      remove: { imports: [CategoryListComponent] },
      add: { imports: [MockCategoryListComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Logic: onCategorySelected', () => {
    it('should set selectedCategoryId and reset selectedProductId', () => {
      // Arrange: Set a previous state
      component.selectedProductId = 'previous-product-123';
      const categoryId = 'cat-1';

      // Act
      component.onCategorySelected(categoryId);

      // Assert
      expect(component.selectedCategoryId).toBe(categoryId);
      // Requirement check: Product ID must be nullified when category changes
      expect(component.selectedProductId).toBeNull();
    });
  });

  describe('Logic: onProductSelected', () => {
    it('should set selectedProductId', () => {
      const productId = 'prod-456';
      
      // Act
      component.onProductSelected(productId);

      // Assert
      expect(component.selectedProductId).toBe(productId);
    });
  });

  describe('Template Integration', () => {
    it('should call onCategorySelected when child component emits event', () => {
      // 1. Query the Mock Child Component
      const childDebugElement = fixture.debugElement.query(By.directive(MockCategoryListComponent));
      const childInstance = childDebugElement.componentInstance as MockCategoryListComponent;

      // 2. Emit the Output Event from the child
      const testCategoryId = 'category-abc';
      childInstance.categorySelected.emit(testCategoryId);

      // 3. Verify the Parent Component state updated
      expect(component.selectedCategoryId).toBe(testCategoryId);
    });
  });
});