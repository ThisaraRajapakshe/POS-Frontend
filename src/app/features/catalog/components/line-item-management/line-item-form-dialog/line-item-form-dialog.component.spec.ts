import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineItemFormDialogComponent } from './line-item-form-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from './../../../services';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Product } from './../../../models';

// Define types locally to ensure strict typing in tests matches expected usage
interface DialogData {
  mode: 'create' | 'edit';
  lineItem?: {
    id: string;
    barCodeId: string;
    cost: number;
    displayPrice: number;
    discountedPrice: number;
    quantity: number;
    product: {
      id: string;
    };
  };
}

describe('LineItemFormDialogComponent', () => {
  let component: LineItemFormDialogComponent;
  let fixture: ComponentFixture<LineItemFormDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<LineItemFormDialogComponent>>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const mockProducts: Product[] = [
    { id: 'prod-1', name: 'Product A', category: { id: 'c1', name: 'Cat1' } },
    { id: 'prod-2', name: 'Product B', category: { id: 'c1', name: 'Cat1' } }
  ];

  // Helper function to configure the TestBed dynamically for different modes
  const configureTestBed = async (data: DialogData) => {
    // 1. Create Spies
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getAll']);
    // Spy created just for DI compliance, not assigned to a variable to avoid unused var rule
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    // 2. Setup Behaviors
    productServiceSpy.getAll.and.returnValue(of(mockProducts));

    // 3. Configure Module
    await TestBed.configureTestingModule({
      imports: [
        LineItemFormDialogComponent,
        NoopAnimationsModule // Required for Material Select/Input
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: ProductService, useValue: productServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LineItemFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers constructor and product loading
  };

  describe('Mode: Create', () => {
    beforeEach(async () => {
      await configureTestBed({ mode: 'create' });
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load products into the select dropdown', () => {
      expect(productServiceSpy.getAll).toHaveBeenCalled();
      expect(component.products.length).toBe(2);
      expect(component.products).toEqual(mockProducts);
    });

    it('should initialize an empty invalid form', () => {
      expect(component.lineItemForm.valid).toBeFalse();
      expect(component.lineItemForm.value).toEqual({
        id: '',
        barCodeId: '',
        productId: '',
        cost: '',
        displayPrice: '',
        discountedPrice: '',
        quantity: ''
      });
    });

    it('should not close dialog on save if form is invalid', () => {
      component.onSave();
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should close dialog with form value on save if valid', () => {
      // Arrange: Fill form
      component.lineItemForm.setValue({
        id: 'li-1',
        barCodeId: '123456',
        productId: 'prod-1',
        cost: 100,
        displayPrice: 150,
        discountedPrice: 140,
        quantity: 10
      });

      // Act
      component.onSave();

      // Assert
      expect(component.lineItemForm.valid).toBeTrue();
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        id: 'li-1',
        barCodeId: '123456',
        productId: 'prod-1',
        cost: 100,
        displayPrice: 150,
        discountedPrice: 140,
        quantity: 10
      });
    });
  });

  describe('Mode: Edit', () => {
    const existingItem = {
      id: 'li-99',
      barCodeId: '999999',
      cost: 50,
      displayPrice: 80,
      discountedPrice: 75,
      quantity: 5,
      product: { id: 'prod-2' }
    };

    beforeEach(async () => {
      await configureTestBed({ mode: 'edit', lineItem: existingItem });
    });

    it('should initialize form with existing data', () => {
      const formValue = component.lineItemForm.value;
      
      expect(formValue.id).toBe(existingItem.id);
      expect(formValue.barCodeId).toBe(existingItem.barCodeId);
      expect(formValue.productId).toBe(existingItem.product.id); // Checks nested mapping
      expect(formValue.cost).toBe(existingItem.cost);
    });

    it('should allow saving immediately if data is unchanged (and valid)', () => {
      expect(component.lineItemForm.valid).toBeTrue();
      
      component.onSave();
      
      expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.objectContaining({
        id: existingItem.id,
        barCodeId: existingItem.barCodeId
      }));
    });
  });

  describe('Common Actions', () => {
    beforeEach(async () => {
      await configureTestBed({ mode: 'create' });
    });

    it('should close dialog when cancel is clicked', () => {
      component.onClose();
      expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
    });
  });
});