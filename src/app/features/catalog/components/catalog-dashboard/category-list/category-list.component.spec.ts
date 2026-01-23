import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryListComponent } from './category-list.component';
import { CategoryService } from '../../../services';
import { Category } from '../../../models';
import { of, throwError } from 'rxjs';
import { Component, Input } from '@angular/core';
import { ProductListComponent } from './product-list/product-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

// 1. Mock Child Component
// This prevents ProductListComponent dependencies from breaking this test
@Component({
  selector: 'pos-product-list',
  standalone: true,
  template: ''
})
class MockProductListComponent {
  @Input() categoryId!: string;
}

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;

  // Mock Data
  const mockCategories: Category[] = [
    { id: '1', name: 'Beverages' },
    { id: '2', name: 'Snacks' }
  ];

  beforeEach(async () => {
    // 2. Create Service Spy
    categoryServiceSpy = jasmine.createSpyObj<CategoryService>('CategoryService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [
        CategoryListComponent,
        // Required to prevent animation errors from MatExpansionModule
        NoopAnimationsModule 
      ],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy }
      ]
    })
    // 3. Override Component to swap real child with mock child
    .overrideComponent(CategoryListComponent, {
      remove: { imports: [ProductListComponent] },
      add: { imports: [MockProductListComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    // Setup default success behavior before init
    categoryServiceSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    expect(component).toBeTruthy();
  });

  describe('Initialization (loadCategories)', () => {
    it('should load categories and render expansion panels', () => {
      // Arrange
      categoryServiceSpy.getAll.and.returnValue(of(mockCategories));

      // Act
      fixture.detectChanges(); // Triggers ngOnInit

      // Assert Logic
      expect(categoryServiceSpy.getAll).toHaveBeenCalled();
      expect(component.message()).toBe('');

      // Assert Template (Async Pipe)
      const panels = fixture.debugElement.queryAll(By.css('mat-expansion-panel'));
      expect(panels.length).toBe(2);
      expect(panels[0].nativeElement.textContent).toContain('Beverages');
    });

    it('should handle errors and display error message', () => {
      // Arrange: Force an error
      categoryServiceSpy.getAll.and.returnValue(throwError(() => new Error('Network Error')));

      // Act
      fixture.detectChanges();

      // Assert Logic
      expect(component.message()).toBe('Error loading categories');

      // Assert Template
      const alertBox = fixture.debugElement.query(By.css('.alert.alert-danger'));
      expect(alertBox).toBeTruthy();
      expect(alertBox.nativeElement.textContent).toContain('Error loading categories');
    });
  });

  describe('User Interaction', () => {
    it('should emit categorySelected event when panel opens', () => {
      // Arrange
      categoryServiceSpy.getAll.and.returnValue(of(mockCategories));
      fixture.detectChanges();
      
      const emitSpy = spyOn(component.categorySelected, 'emit');

      // Act
      // We call the method directly to ensure the logic works. 
      // (Testing purely the framework's (opened) event binding is often redundant, 
      // but testing the method ensures our logic is sound).
      component.selectCategory('1');

      // Assert
      expect(emitSpy).toHaveBeenCalledWith('1');
    });
  });
});