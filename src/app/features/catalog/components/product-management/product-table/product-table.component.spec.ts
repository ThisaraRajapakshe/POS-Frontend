import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductTableComponent } from './product-table.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Product } from '../../../models';
import { By } from '@angular/platform-browser';

describe('ProductTableComponent', () => {
  let component: ProductTableComponent;
  let fixture: ComponentFixture<ProductTableComponent>;

  // Mock Data
  const mockProducts: Product[] = [
    {
      id: 'p-1',
      name: 'Apple',
      category: { id: 'c-1', name: 'Fruits' },
      // Add other required Product fields if your interface is strict (e.g., price, stock)
    } as Product, 
    {
      id: 'p-2',
      name: 'Carrot',
      category: { id: 'c-2', name: 'Vegetables' },
    } as Product
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductTableComponent,
        NoopAnimationsModule // Required for Material Table
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTableComponent);
    component = fixture.componentInstance;
    
    // Trigger initial detection to run ngAfterViewInit
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input: products', () => {
    it('should update dataSource when input is set', () => {
      // Act: Use setInput for Signals
      fixture.componentRef.setInput('products', mockProducts);
      fixture.detectChanges(); // Trigger the effect()

      // Assert
      expect(component.dataSource.data).toEqual(mockProducts);
      expect(component.dataSource.data.length).toBe(2);
    });
  });

  describe('View Initialization', () => {
    it('should attach paginator and sort to dataSource after view init', () => {
      expect(component.dataSource.paginator).toBeTruthy();
      expect(component.dataSource.sort).toBeTruthy();
    });
  });

  describe('Sorting Logic (Custom Accessor)', () => {
    beforeEach(() => {
      // Setup data for sorting tests
      fixture.componentRef.setInput('products', mockProducts);
      fixture.detectChanges();
    });

    it('should sort by nested "category" name', () => {
      const accessor = component.dataSource.sortingDataAccessor;
      const item = mockProducts[0]; // Category: Fruits

      // Act
      const result = accessor(item, 'category');

      // Assert
      expect(result).toBe('Fruits');
    });

    it('should sort by standard properties (name)', () => {
      const accessor = component.dataSource.sortingDataAccessor;
      const item = mockProducts[0]; // Name: Apple

      // Act
      const result = accessor(item, 'name');

      // Assert
      expect(result).toBe('Apple');
    });

    it('should handle undefined category gracefully', () => {
      const accessor = component.dataSource.sortingDataAccessor;
      // Create partial object with missing category
      const item = { ...mockProducts[0], category: undefined } as unknown as Product;

      // Act
      const result = accessor(item, 'category');

      // Assert
      expect(result).toBe('');
    });
  });

  describe('User Interaction', () => {
    beforeEach(() => {
      // Setup data to render rows
      fixture.componentRef.setInput('products', mockProducts);
      fixture.detectChanges();
    });

    it('should emit editProduct when Edit button is clicked', () => {
      // Arrange
      const emitSpy = spyOn(component.editProduct, 'emit');
      // Query the first row's primary button
      const editBtn = fixture.debugElement.query(By.css('button[color="primary"]'));

      // Act
      editBtn.triggerEventHandler('click', null);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(mockProducts[0]);
    });

    it('should emit deleteProduct when Delete button is clicked', () => {
      // Arrange
      const emitSpy = spyOn(component.deleteProduct, 'emit');
      // Query the first row's warn button
      const deleteBtn = fixture.debugElement.query(By.css('button[color="warn"]'));

      // Act
      deleteBtn.triggerEventHandler('click', null);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(mockProducts[0]);
    });
  });

  describe('Template Rendering', () => {
    it('should render correct number of rows', () => {
      fixture.componentRef.setInput('products', mockProducts);
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('tr[mat-row]'));
      expect(rows.length).toBe(2);
    });

    it('should render nested category name in cell', () => {
      fixture.componentRef.setInput('products', mockProducts);
      fixture.detectChanges();

      // Column indices: 0: ID, 1: Name, 2: Category, 3: Actions
      const firstRowCells = fixture.debugElement.queryAll(By.css('tr[mat-row] td'));
      // Adjust index based on your displayedColumns array. 
      // If displayedColumns = ['id', 'name', 'category', 'actions'], category is index 2.
      const categoryCell = firstRowCells[2];

      expect(categoryCell.nativeElement.textContent.trim()).toBe('Fruits');
    });
  });
});