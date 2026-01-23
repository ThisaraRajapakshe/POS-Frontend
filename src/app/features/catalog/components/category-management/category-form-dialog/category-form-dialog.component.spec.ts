import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryFormDialogComponent } from './category-form-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

// Define an interface for the dialog data to ensure strict typing (no 'any')
interface DialogData {
  mode: 'create' | 'edit';
  category?: { id: string; name: string };
}

describe('CategoryFormDialogComponent', () => {
  let component: CategoryFormDialogComponent;
  let fixture: ComponentFixture<CategoryFormDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CategoryFormDialogComponent>>;

  // Define logic to configure module dynamically based on mode
  const configureModule = async (data: DialogData) => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        CategoryFormDialogComponent,
        NoopAnimationsModule // Required for Material components
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('Mode: Create', () => {
    const mockCreateData: DialogData = { mode: 'create' };

    beforeEach(async () => {
      await configureModule(mockCreateData);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize an empty invalid form', () => {
      const formValue = component.categoryForm.value;
      expect(formValue.id).toBe('');
      expect(formValue.name).toBe('');
      expect(component.categoryForm.valid).toBeFalse();
    });

    it('should display "New Category" title', () => {
      const title = fixture.debugElement.query(By.css('[mat-dialog-title]'));
      expect(title.nativeElement.textContent).toBe('New Category');
    });

    it('should show the ID input field', () => {
      // Logic: @if (data.mode !== 'edit')
      const idInput = fixture.debugElement.query(By.css('input[formControlName="id"]'));
      expect(idInput).toBeTruthy();
    });

    it('should NOT close dialog on save if form is invalid', () => {
      component.onSave();
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should close dialog with form value on save if valid', () => {
      // Arrange: Set valid data
      component.categoryForm.setValue({ id: '101', name: 'Fresh Items' });
      
      // Act
      component.onSave();

      // Assert
      expect(dialogRefSpy.close).toHaveBeenCalledWith({ id: '101', name: 'Fresh Items' });
    });

    it('should close dialog without data on close', () => {
      component.onClose();
      // Expect close called with no arguments
      expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
      // We check the arguments list to ensure it was empty/undefined
      const calls = dialogRefSpy.close.calls.allArgs();
      expect(calls[0].length).toBe(0); 
    });
  });

  describe('Mode: Edit', () => {
    const mockEditData: DialogData = { 
      mode: 'edit', 
      category: { id: '999', name: 'Existing Item' } 
    };

    beforeEach(async () => {
      await configureModule(mockEditData);
    });

    it('should initialize form with existing category data', () => {
      const formValue = component.categoryForm.value;
      expect(formValue.id).toBe('999');
      expect(formValue.name).toBe('Existing Item');
      expect(component.categoryForm.valid).toBeTrue();
    });

    it('should display "Edit Category" title', () => {
      const title = fixture.debugElement.query(By.css('[mat-dialog-title]'));
      expect(title.nativeElement.textContent).toBe('Edit Category');
    });

    it('should HIDE the ID input field', () => {
      // Logic: @if (data.mode !== 'edit') -> checks that this block is NOT rendered
      const idInput = fixture.debugElement.query(By.css('input[formControlName="id"]'));
      expect(idInput).toBeNull();
    });

    it('should close with updated values on save', () => {
      // Arrange: Modify the name
      component.categoryForm.controls['name'].setValue('Updated Name');

      // Act
      component.onSave();

      // Assert
      expect(dialogRefSpy.close).toHaveBeenCalledWith({ id: '999', name: 'Updated Name' });
    });
  });
});