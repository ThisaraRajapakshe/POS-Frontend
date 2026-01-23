import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryTableComponent } from './category-table.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleChange } from '@angular/core';
import { of } from 'rxjs';
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
        CategoryTableComponent,
        // Material Table components often require animations module
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryTableComponent);
    component = fixture.componentInstance;
    
    // Initial change detection to ensure ViewChildren (Paginator/Sort) are initialized
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Data Initialization (ngOnChanges)', () => {
    it('should subscribe to categories$ and populate dataSource', () => {
      // Arrange
      component.categories$ = of(mockCategories);

      // Act: Manually trigger ngOnChanges to simulate Input binding
      component.ngOnChanges({
        categories$: new SimpleChange(null, component.categories$, true)
      });
      
      // Assert
      expect(component.dataSource.data).toEqual(mockCategories);
      // Verify ViewChildren were assigned
      expect(component.dataSource.paginator).toBeTruthy();
      expect(component.dataSource.sort).toBeTruthy();
    });

    it('should unsubscribe from previous subscription when input changes', () => {
      // Arrange
      component.categories$ = of(mockCategories);
      
      // Call once
      component.ngOnChanges({
        categories$: new SimpleChange(null, component.categories$, true)
      });

      // Capture the subscription to check later
      // Access private property via casting for testing purposes
      const oldSubscription = (component as unknown as { subscription: { closed: boolean } }).subscription;
      
      // Act: Call again with new data
      const newCategories$ = of([]);
      component.categories$ = newCategories$;
      component.ngOnChanges({
        categories$: new SimpleChange(mockCategories, newCategories$, false)
      });

      // Assert: Old subscription should be closed (unsubscribed)
      expect(oldSubscription.closed).toBeTrue();
    });
  });

  describe('User Interaction', () => {
    beforeEach(() => {
      // Setup data for interaction tests
      component.categories$ = of(mockCategories);
      component.ngOnChanges({
        categories$: new SimpleChange(null, component.categories$, true)
      });
      fixture.detectChanges(); // Update view with rows
    });

    it('should emit editCategory event when Edit button is clicked', () => {
      // Arrange
      const emitSpy = spyOn(component.editCategory, 'emit');
      const firstRowEditBtn = fixture.debugElement.query(By.css('button[color="primary"]')); // Primary is Edit based on template

      // Act
      firstRowEditBtn.triggerEventHandler('click', null);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(mockCategories[0]);
    });

    it('should emit deleteCategory event when Delete button is clicked', () => {
      // Arrange
      const emitSpy = spyOn(component.deleteCategory, 'emit');
      const firstRowDeleteBtn = fixture.debugElement.query(By.css('button[color="warn"]')); // Warn is Delete based on template

      // Act
      firstRowDeleteBtn.triggerEventHandler('click', null);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(mockCategories[0]);
    });
  });

  describe('Template Rendering', () => {
    it('should render correct number of rows', () => {
      // Arrange
      component.categories$ = of(mockCategories);
      component.ngOnChanges({
        categories$: new SimpleChange(null, component.categories$, true)
      });
      fixture.detectChanges();

      // Act
      const rows = fixture.debugElement.queryAll(By.css('tr[mat-row]'));

      // Assert
      expect(rows.length).toBe(2);
    });

    it('should render correct cell data', () => {
      // Arrange
      component.categories$ = of(mockCategories);
      component.ngOnChanges({
        categories$: new SimpleChange(null, component.categories$, true)
      });
      fixture.detectChanges();

      // Act
      const firstRowCells = fixture.debugElement.queryAll(By.css('tr[mat-row] td'));

      // Assert
      // Column 0: ID, Column 1: Name, Column 2: Actions
      expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('1');
      expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('Electronics');
    });
  });
});