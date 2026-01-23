import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineItemManagementComponent } from './line-item-management.component';
import { ProductLineItemService } from '../../services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { ProductLineItem } from '../../models';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LineItemTableComponent } from './line-item-table/line-item-table.component';
import { CardWrapperComponent } from '../../../../shared/Components/card-wrapper/card-wrapper.component';
import { By } from '@angular/platform-browser';

// --- 1. Mock Child Components ---
@Component({
  selector: 'pos-line-item-table',
  standalone: true,
  template: ''
})
class MockLineItemTableComponent {
  @Input() lineItems: ProductLineItem[] | null = [];
  @Output() editLineItem = new EventEmitter<ProductLineItem>();
  @Output() deleteLineItem = new EventEmitter<ProductLineItem>();
}

@Component({
  selector: 'pos-card-wrapper',
  standalone: true,
  template: '<ng-content></ng-content>'
})
class MockCardWrapperComponent {
  @Input() width = '100';
}

describe('LineItemManagementComponent', () => {
  let component: LineItemManagementComponent;
  let fixture: ComponentFixture<LineItemManagementComponent>;

  // Spies
  let lineItemServiceSpy: jasmine.SpyObj<ProductLineItemService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  // Mock Data
  const mockLineItem: ProductLineItem = {
    id: 'li-1',
    barCodeId: '123456',
    productId: 'p-1',
    cost: 50,
    displayPrice: 100,
    discountedPrice: 90,
    quantity: 10,
    product: { id: 'p-1', name: 'Test Product', category: { id: 'c-1', name: 'Cat' } }
  };

  beforeEach(async () => {
    // 2. Initialize Spies
    lineItemServiceSpy = jasmine.createSpyObj('ProductLineItemService', ['getAll', 'create', 'update', 'delete']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    // Default Behavior
    lineItemServiceSpy.getAll.and.returnValue(of([mockLineItem]));

    await TestBed.configureTestingModule({
      imports: [LineItemManagementComponent],
      providers: [
        { provide: ProductLineItemService, useValue: lineItemServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    })
    // 3. Override Imports to use Mock Children
    .overrideComponent(LineItemManagementComponent, {
      remove: { imports: [LineItemTableComponent, CardWrapperComponent] },
      add: { imports: [MockLineItemTableComponent, MockCardWrapperComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineItemManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit -> loadLineItems
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load line items on init', () => {
      expect(lineItemServiceSpy.getAll).toHaveBeenCalled();
      
      component.lineItems$.subscribe(data => {
        expect(data.length).toBe(1);
        expect(data[0]).toEqual(mockLineItem);
      });
    });

    it('should handle error when loading fails', () => {
      // Arrange
      lineItemServiceSpy.getAll.and.returnValue(throwError(() => new Error('API Error')));
      
      // Act
      component.loadLineItems();

      // Assert
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Failed to load line items', 
        'Close', 
        jasmine.objectContaining({ panelClass: ['snackbar-error'] })
      );
      
      // Should return empty array on error
      component.lineItems$.subscribe(data => {
        expect(data).toEqual([]);
      });
    });
  });

  describe('Add Line Item', () => {
    it('should open dialog and create item on success', () => {
      // Arrange
      const newItemData = { ...mockLineItem, id: 'new-id' };
      
      // Mock DialogRef
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(newItemData));
      dialogSpy.open.and.returnValue(dialogRefSpy);

      // Mock Create Success
      lineItemServiceSpy.create.and.returnValue(of(newItemData));

      // Act
      component.onAdd();

      // Assert
      expect(dialogSpy.open).toHaveBeenCalled();
      expect(lineItemServiceSpy.create).toHaveBeenCalledWith(newItemData);
      expect(snackBarSpy.open).toHaveBeenCalledWith('Line item created successfully', 'Close', jasmine.any(Object));
      expect(lineItemServiceSpy.getAll).toHaveBeenCalledTimes(2); // Init + Reload
    });

    it('should handle create error', () => {
      // Arrange
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(mockLineItem));
      dialogSpy.open.and.returnValue(dialogRefSpy);

      lineItemServiceSpy.create.and.returnValue(throwError(() => new Error('Create Failed')));

      // Act
      component.onAdd();

      // Assert
      expect(snackBarSpy.open).toHaveBeenCalledWith('Failed to create line item', 'Close', jasmine.any(Object));
    });
  });

  describe('Edit Line Item', () => {
    it('should open dialog and update item on success', () => {
      // Arrange
      const updatedData = { ...mockLineItem, cost: 999 };
      
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(updatedData));
      dialogSpy.open.and.returnValue(dialogRefSpy);

      lineItemServiceSpy.update.and.returnValue(of(updatedData));

      // Act: Trigger via child component event emission
      const mockTable = fixture.debugElement.query(By.directive(MockLineItemTableComponent)).componentInstance as MockLineItemTableComponent;
      mockTable.editLineItem.emit(mockLineItem);

      // Assert
      expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), jasmine.objectContaining({
        data: { mode: 'edit', lineItem: mockLineItem }
      }));
      expect(lineItemServiceSpy.update).toHaveBeenCalledWith(mockLineItem.id, updatedData);
      expect(snackBarSpy.open).toHaveBeenCalledWith('Line item updated successfully', 'Close', jasmine.any(Object));
    });
  });

  describe('Delete Line Item', () => {
    it('should open confirm dialog and delete on confirmation', () => {
      // Arrange
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(true)); // Confirmed
      dialogSpy.open.and.returnValue(dialogRefSpy);

      lineItemServiceSpy.delete.and.returnValue(of(void 0));

      // Act: Trigger via child component
      const mockTable = fixture.debugElement.query(By.directive(MockLineItemTableComponent)).componentInstance as MockLineItemTableComponent;
      mockTable.deleteLineItem.emit(mockLineItem);

      // Assert
      expect(dialogSpy.open).toHaveBeenCalled();
      expect(lineItemServiceSpy.delete).toHaveBeenCalledWith(mockLineItem.id);
      expect(snackBarSpy.open).toHaveBeenCalledWith('Line item deleted successfully', 'Close', jasmine.any(Object));
    });

    it('should not delete if dialog is cancelled', () => {
      // Arrange
      const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(false)); // Cancelled
      dialogSpy.open.and.returnValue(dialogRefSpy);

      // Act
      component.onDelete(mockLineItem);

      // Assert
      expect(lineItemServiceSpy.delete).not.toHaveBeenCalled();
    });
  });
});