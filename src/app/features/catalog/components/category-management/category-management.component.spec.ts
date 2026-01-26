import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryManagementComponent } from './category-management.component';
import { CategoryService } from '../../services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { Category } from '../../models';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryTableComponent } from './category-table/category-table.component';
import { CardWrapperComponent } from '../../../../shared/Components/card-wrapper/card-wrapper.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

// --- 1. Mock Child Components ---
// Isolate the test from child dependencies
@Component({
  selector: 'pos-category-table',
  standalone: true,
  template: ''
})
class MockCategoryTableComponent {
  @Input() categories: Category[] = [];
  @Output() editCategory = new EventEmitter<Category>();
  @Output() deleteCategory = new EventEmitter<Category>();
}

@Component({
  selector: 'pos-card-wrapper',
  standalone: true,
  template: '<ng-content></ng-content>'
})
class MockCardWrapperComponent {
  @Input() width = '100';
}

describe('CategoryManagementComponent', () => {
  let component: CategoryManagementComponent;
  let fixture: ComponentFixture<CategoryManagementComponent>;

  // Spies
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  // Mock Data
  const mockCategories: Category[] = [
    { id: '1', name: 'Drinks' },
    { id: '2', name: 'Snacks' }
  ];

  beforeEach(async () => {
    // 2. Create Spies
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getAll', 'create', 'update', 'delete']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    // Default Service Behavior
    categoryServiceSpy.getAll.and.returnValue(of(mockCategories));

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<unknown>);

    await TestBed.configureTestingModule({
      imports: [
        CategoryManagementComponent,// Standalone component
        NoopAnimationsModule // Prevent animation errors if real components leak through
      ], 
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })

    // 3. FORCE OVERRIDE
    // This tells Angular: "I don't care what the component imports, use THIS spy."
    .overrideProvider(MatDialog, { useValue: dialogSpy })
    .overrideProvider(MatSnackBar, { useValue: snackBarSpy })

    // 3. Override Imports to use Mock Children
    .overrideComponent(CategoryManagementComponent, {
      remove: { imports: [CategoryTableComponent, CardWrapperComponent] },
      add: { imports: [MockCategoryTableComponent, MockCardWrapperComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit -> loadCategories
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load categories on init', () => {
      expect(categoryServiceSpy.getAll).toHaveBeenCalled();
      // Subscribe to the observable public property to verify data
      expect(component.categories()).toEqual(mockCategories);
    });

    it('should handle error when loading categories fails', () => {
      // Arrange
      categoryServiceSpy.getAll.and.returnValue(throwError(() => new Error('API Error')));
      
      // Act
      component.loadCategories(); // Call manually to test specific error flow
      
      // Assert
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Failed to load categories', 
        'Close', 
        jasmine.objectContaining({ panelClass: ['snackbar-error'] })
      );
    });
  });

  describe('Add Category', () => {
    it('should open dialog and create category on success', () => {
      // Arrange
      const newCategoryData = { id: '3', name: 'New Item' };
      // Mock the Dialog Ref object returned by .open()
      const mockDialogRef = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      mockDialogRef.afterClosed.and.returnValue(of(newCategoryData));
      
      dialogSpy.open.and.returnValue(mockDialogRef);
      categoryServiceSpy.create.and.returnValue(of({...newCategoryData }));

      // Act
      component.openAddCategory();

      // Assert
      expect(dialogSpy.open).toHaveBeenCalled();
      expect(categoryServiceSpy.create).toHaveBeenCalledWith(newCategoryData);
      expect(snackBarSpy.open).toHaveBeenCalledWith('Category created successfully', 'Close', jasmine.any(Object));
      expect(categoryServiceSpy.getAll).toHaveBeenCalledTimes(2); // Once on init, once after create
    });

    it('should do nothing if add dialog is cancelled', () => {
      // Arrange
      const mockDialogRef = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      mockDialogRef.afterClosed.and.returnValue(of(null)); // User cancelled
      dialogSpy.open.and.returnValue(mockDialogRef);

      // Act
      component.openAddCategory();

      // Assert
      expect(categoryServiceSpy.create).not.toHaveBeenCalled();
    });
  });

  describe('Edit Category', () => {
    it('should open dialog and update category', () => {
      // Arrange
      const targetCategory = mockCategories[0];
      const updatedData = { name: 'Drinks Updated' };

      const mockDialogRef = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      mockDialogRef.afterClosed.and.returnValue(of(updatedData));
      
      dialogSpy.open.and.returnValue(mockDialogRef);
      categoryServiceSpy.update.and.returnValue(of({ ...targetCategory, ...updatedData }));

      // Act
      // Simulate Event from Mock Table
      const mockTable = fixture.debugElement.query(By.directive(MockCategoryTableComponent)).componentInstance as MockCategoryTableComponent;
      mockTable.editCategory.emit(targetCategory);

      // Assert
      expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), jasmine.objectContaining({
        data: { mode: 'edit', category: targetCategory }
      }));
      expect(categoryServiceSpy.update).toHaveBeenCalledWith(targetCategory.id, updatedData);
      expect(snackBarSpy.open).toHaveBeenCalledWith(jasmine.stringMatching(/updated successfully/), 'Close', jasmine.any(Object));
    });

    it('should handle update error', () => {
      // Arrange
      const targetCategory = mockCategories[0];
      const mockDialogRef = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      mockDialogRef.afterClosed.and.returnValue(of({ name: 'Fail' }));
      
      dialogSpy.open.and.returnValue(mockDialogRef);
      categoryServiceSpy.update.and.returnValue(throwError(() => new Error('Update Failed')));

      // Act
      component.openEditCategory(targetCategory);

      // Assert
      expect(snackBarSpy.open).toHaveBeenCalledWith(jasmine.stringMatching(/Failed to update/), 'Close', jasmine.any(Object));
    });
  });

  describe('Delete Category', () => {
    it('should open confirm dialog and delete on confirmation', () => {
      // Arrange
      const targetCategory = mockCategories[1];

      const mockDialogRef = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      mockDialogRef.afterClosed.and.returnValue(of(true)); // User Confirmed
      
      dialogSpy.open.and.returnValue(mockDialogRef);
      categoryServiceSpy.delete.and.returnValue(of(void 0));

      // Act
      const mockTable = fixture.debugElement.query(By.directive(MockCategoryTableComponent)).componentInstance as MockCategoryTableComponent;
      mockTable.deleteCategory.emit(targetCategory);

      // Assert
      expect(dialogSpy.open).toHaveBeenCalled(); // Check ConfirmDialog was opened
      expect(categoryServiceSpy.delete).toHaveBeenCalledWith(targetCategory.id);
      expect(snackBarSpy.open).toHaveBeenCalledWith(jasmine.stringMatching(/deleted successfully/), 'Close', jasmine.any(Object));
    });
  });
});