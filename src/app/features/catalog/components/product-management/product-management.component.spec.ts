import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductManagementComponent } from './product-management.component';
import { ProductService } from '../../services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { Product } from '../../models'; // Assumed path based on imports
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductTableComponent } from './product-table/product-table.component';
import { CardWrapperComponent } from '../../../../shared/Components/card-wrapper/card-wrapper.component';
import { By } from '@angular/platform-browser';

// --- 1. Mock Child Components ---
// Isolate the test from child dependencies
@Component({
  selector: 'pos-product-table',
  standalone: true,
  template: ''
})
class MockProductTableComponent {
  @Input() products: Product[] = [];
  @Output() editProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<Product>();
}

@Component({
  selector: 'pos-card-wrapper',
  standalone: true,
  template: '<ng-content></ng-content>'
})
class MockCardWrapperComponent {
  @Input() width = '100';
}

describe('ProductManagementComponent', () => {
  let component: ProductManagementComponent;
  let fixture: ComponentFixture<ProductManagementComponent>;

  // Spies
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  // Mock Data
  const mockProduct: Product = {
    id: 'p-1',
    name: 'Test Product',
    category: { id: 'c-1', name: 'Cat' }
  } as Product; // Casting to satisfy interface if it has more props

  beforeEach(async () => {
    // 2. Initialize Spies
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getAll', 'create', 'update', 'delete']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    // Default Behavior
    productServiceSpy.getAll.and.returnValue(of([mockProduct]));

    await TestBed.configureTestingModule({
      imports: [ProductManagementComponent], // Standalone component
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    })
    // 3. Override Imports to use Mock Children
    .overrideComponent(ProductManagementComponent, {
      remove: { imports: [ProductTableComponent, CardWrapperComponent] },
      add: { imports: [MockProductTableComponent, MockCardWrapperComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit -> loadProducts
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load products on init', () => {
      expect(productServiceSpy.getAll).toHaveBeenCalled();
      
      component.products$.subscribe(data => {
        expect(data.length).toBe(1);
        expect(data[0]).toEqual(mockProduct);
      });
    });

    it('should handle error when loading fails', () => {
      // Arrange
      productServiceSpy.getAll.and.returnValue(throwError(() => new Error('API Error')));
      
      // Act
      component.loadProducts();

      // Force Subscription
      component.products$.subscribe();
      
      // Assert
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Failed to load products', 
        'Close', 
        jasmine.objectContaining({ panelClass: ['snackbar-error'] })
      );
      
      // Should return empty array on error
      component.products$.subscribe(data => {
        expect(data).toEqual([]);
      });
    });
  });

  describe('Add Product', () => {
    it('should open dialog and create product on success', () => {
      // Arrange
      const newProductData = { ...mockProduct, id: 'new-id' };
      
      // Mock DialogRef
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(newProductData));
      dialogSpy.open.and.returnValue(dialogRefSpy);

      // Mock Create Success
      productServiceSpy.create.and.returnValue(of(newProductData));

      // Act
      component.openAddProduct();

      // Assert
      expect(dialogSpy.open).toHaveBeenCalled();
      expect(productServiceSpy.create).toHaveBeenCalledWith(newProductData);
      expect(snackBarSpy.open).toHaveBeenCalledWith('Product created successfully', 'Close', jasmine.any(Object));
      expect(productServiceSpy.getAll).toHaveBeenCalledTimes(2); // Init + Reload
    });

    it('should handle create error', () => {
      // Arrange
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(mockProduct));
      dialogSpy.open.and.returnValue(dialogRefSpy);

      productServiceSpy.create.and.returnValue(throwError(() => new Error('Create Failed')));

      // Act
      component.openAddProduct();

      // Assert
      expect(snackBarSpy.open).toHaveBeenCalledWith('Failed to create product', 'Close', jasmine.any(Object));
    });
  });

  describe('Edit Product', () => {
    it('should open dialog and update product on success', () => {
      // Arrange
      const updatedData = { ...mockProduct, name: 'Updated Name' };
      
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(updatedData));
      dialogSpy.open.and.returnValue(dialogRefSpy);

      productServiceSpy.update.and.returnValue(of(updatedData));

      // Act: Trigger via child component event emission
      const mockTable = fixture.debugElement.query(By.directive(MockProductTableComponent)).componentInstance as MockProductTableComponent;
      mockTable.editProduct.emit(mockProduct);

      // Assert
      expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), jasmine.objectContaining({
        data: { mode: 'edit', product: mockProduct }
      }));
      expect(productServiceSpy.update).toHaveBeenCalledWith(mockProduct.id, updatedData);
      expect(snackBarSpy.open).toHaveBeenCalledWith('Product updated successfully', 'Close', jasmine.any(Object));
    });

    it('should handle update error', () => {
       // Arrange
       const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
       dialogRefSpy.afterClosed.and.returnValue(of(mockProduct));
       dialogSpy.open.and.returnValue(dialogRefSpy);
 
       productServiceSpy.update.and.returnValue(throwError(() => new Error('Update Failed')));

       // Act
       component.openEditProduct(mockProduct);

       // Assert
       expect(snackBarSpy.open).toHaveBeenCalledWith('Failed to update product', 'Close', jasmine.any(Object));
    });
  });

  describe('Delete Product', () => {
    it('should open confirm dialog and delete on confirmation', () => {
      // Arrange
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(true)); // Confirmed
      dialogSpy.open.and.returnValue(dialogRefSpy);

      productServiceSpy.delete.and.returnValue(of(void 0));

      // Act: Trigger via child component
      const mockTable = fixture.debugElement.query(By.directive(MockProductTableComponent)).componentInstance as MockProductTableComponent;
      mockTable.deleteProduct.emit(mockProduct);

      // Assert
      expect(dialogSpy.open).toHaveBeenCalled();
      expect(productServiceSpy.delete).toHaveBeenCalledWith(mockProduct.id);
      expect(snackBarSpy.open).toHaveBeenCalledWith('Product deleted successfully', 'Close', jasmine.any(Object));
    });

    it('should not delete if dialog is cancelled', () => {
      // Arrange
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(false)); // Cancelled
      dialogSpy.open.and.returnValue(dialogRefSpy);

      // Act
      component.confirmDelete(mockProduct);

      // Assert
      expect(productServiceSpy.delete).not.toHaveBeenCalled();
    });

    it('should handle delete error', () => {
        // Arrange
        const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
        dialogRefSpy.afterClosed.and.returnValue(of(true));
        dialogSpy.open.and.returnValue(dialogRefSpy);

        productServiceSpy.delete.and.returnValue(throwError(() => new Error('Delete Failed')));

        // Act
        component.confirmDelete(mockProduct);

        // Assert
        expect(snackBarSpy.open).toHaveBeenCalledWith('Failed to delete product', 'Close', jasmine.any(Object));
    });
  });
});