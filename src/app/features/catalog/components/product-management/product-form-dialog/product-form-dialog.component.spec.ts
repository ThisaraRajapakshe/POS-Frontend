import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormDialogComponent } from './product-form-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../services';
import { Category } from '../../../models';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Define strict interface for Dialog Data to avoid 'any'
interface DialogData {
  mode: 'create' | 'edit';
  product?: {
    id: string;
    name: string;
    category: {
      id: string;
    };
  };
}

describe('ProductFormDialogComponent', () => {
  let component: ProductFormDialogComponent;
  let fixture: ComponentFixture<ProductFormDialogComponent>;
  
  // Spies
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ProductFormDialogComponent>>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;

  // Mock Data
  const mockCategories: Category[] = [
    { id: 'c-1', name: 'Electronics' },
    { id: 'c-2', name: 'Books' }
  ];

  // Helper to configure TestBed dynamically based on Dialog Mode
  const configureTestBed = async (data: DialogData) => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getAll']);

    // Setup default behavior
    categoryServiceSpy.getAll.and.returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      imports: [
        ProductFormDialogComponent,
        NoopAnimationsModule // Required for Material Select animations
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit/constructor logic
  };

  describe('Mode: Create', () => {
    beforeEach(async () => {
      await configureTestBed({ mode: 'create' });
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load categories into the component', () => {
      expect(categoryServiceSpy.getAll).toHaveBeenCalled();
      expect(component.categories).toEqual(mockCategories);
    });

    it('should initialize an empty form', () => {
      const formValue = component.productForm.value;
      expect(formValue.id).toBe('');
      expect(formValue.name).toBe('');
      expect(formValue.categoryId).toBe('');
    });

    it('should mark form as invalid when empty', () => {
      expect(component.productForm.valid).toBeFalse();
    });

    it('should NOT close dialog on save if form is invalid', () => {
      component.onSave();
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should close dialog with form data when valid', () => {
      // Arrange
      component.productForm.setValue({
        id: '101',
        name: 'New Product',
        categoryId: 'c-1'
      });

      // Act
      component.onSave();

      // Assert
      expect(component.productForm.valid).toBeTrue();
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        id: '101',
        name: 'New Product',
        categoryId: 'c-1'
      });
    });
  });

  describe('Mode: Edit', () => {
    const existingProduct = {
      id: 'p-99',
      name: 'Existing Product',
      category: { id: 'c-2' }
    };

    beforeEach(async () => {
      await configureTestBed({ mode: 'edit', product: existingProduct });
    });

    it('should initialize form with existing product data', () => {
      const formValue = component.productForm.value;
      expect(formValue.id).toBe('p-99');
      expect(formValue.name).toBe('Existing Product');
      expect(formValue.categoryId).toBe('c-2');
    });

    it('should be valid on load', () => {
      expect(component.productForm.valid).toBeTrue();
    });

    it('should update values and close on save', () => {
      // Arrange: Change the name
      component.productForm.controls['name'].setValue('Updated Name');

      // Act
      component.onSave();

      // Assert
      expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.objectContaining({
        id: 'p-99',
        name: 'Updated Name',
        categoryId: 'c-2'
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