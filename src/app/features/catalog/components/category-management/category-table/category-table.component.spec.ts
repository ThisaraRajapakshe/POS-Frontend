import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryTableComponent } from './category-table.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Category } from './../../../models';
import { By } from '@angular/platform-browser';

describe('CategoryTableComponent', () => {
  let component: CategoryTableComponent;
  let fixture: ComponentFixture<CategoryTableComponent>;

  const mockCategories: Category[] = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Groceries' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CategoryTableComponent, // Standalone component
        NoopAnimationsModule    // Required for Material Table
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryTableComponent);
    component = fixture.componentInstance;
    
    // Initial detection (View setup)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Data Initialization (Signals)', () => {
    it('should update dataSource when signal input changes', () => {
      // Act: Set the signal input using the modern API
      fixture.componentRef.setInput('categories', mockCategories);
      
      // Trigger change detection so the 'effect()' runs
      fixture.detectChanges();
      
      // Assert
      expect(component.dataSource.data).toEqual(mockCategories);
      
      // Verify Paginator & Sort are attached
      expect(component.dataSource.paginator).toBeTruthy();
      expect(component.dataSource.sort).toBeTruthy();
    });
  });

  describe('User Interaction', () => {
    beforeEach(() => {
      // Setup data for the view
      fixture.componentRef.setInput('categories', mockCategories);
      fixture.detectChanges(); // Render rows
    });

    it('should emit editCategory event when Edit button is clicked', () => {
      // Arrange
      const emitSpy = spyOn(component.editCategory, 'emit');
      // Find the first "Edit" button (assuming primary color in template)
      const firstRowEditBtn = fixture.debugElement.query(By.css('button[color="primary"]')); 

      // Act
      firstRowEditBtn.triggerEventHandler('click', null);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(mockCategories[0]);
    });

    it('should emit deleteCategory event when Delete button is clicked', () => {
      // Arrange
      const emitSpy = spyOn(component.deleteCategory, 'emit');
      // Find the first "Delete" button (assuming warn color in template)
      const firstRowDeleteBtn = fixture.debugElement.query(By.css('button[color="warn"]')); 

      // Act
      firstRowDeleteBtn.triggerEventHandler('click', null);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(mockCategories[0]);
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
        fixture.componentRef.setInput('categories', mockCategories);
        fixture.detectChanges();
    });

    it('should render correct number of rows', () => {
      // Act
      const rows = fixture.debugElement.queryAll(By.css('tr[mat-row]'));

      // Assert
      expect(rows.length).toBe(2);
    });

    it('should render correct cell data', () => {
      // Act
      const firstRowCells = fixture.debugElement.queryAll(By.css('tr[mat-row] td'));

      // Assert
      // Column 0: ID, Column 1: Name
      expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('1');
      expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('Electronics');
    });
  });
});