import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineItemTableComponent } from './line-item-table.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductLineItem } from '../../../models';
import { By } from '@angular/platform-browser';

describe('LineItemTableComponent', () => {
  let component: LineItemTableComponent;
  let fixture: ComponentFixture<LineItemTableComponent>;

  // Mock Data conforming to strict ProductLineItem interface
  // We include the nested 'product' object to test the custom sorting accessor
  const mockLineItems: ProductLineItem[] = [
    {
      id: '1',
      barCodeId: 'BC-001',
      productId: 'P-1',
      product: { id: 'P-1', name: 'Alpha Product', category: { id: 'c1', name: 'Cat1'} },
      cost: 100,
      displayPrice: 150,
      discountedPrice: 140,
      quantity: 10
    },
    {
      id: '2',
      barCodeId: 'BC-002',
      productId: 'P-2',
      product: { id: 'P-2', name: 'Beta Product', category: { id: 'c1', name: 'Cat1'} },
      cost: 200,
      displayPrice: 250,
      discountedPrice: 240,
      quantity: 5
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LineItemTableComponent,
        // Material Table/Paginator/Sort use animations, using Noop prevents errors
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LineItemTableComponent);
    component = fixture.componentInstance;
    
    // Trigger initial change detection to run ngAfterViewInit (paginator/sort setup)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input: lineItems', () => {
    it('should update dataSource when input is set', () => {
      // Act
      component.lineItems = mockLineItems;
      fixture.detectChanges();

      // Assert
      expect(component.dataSource.data).toEqual(mockLineItems);
      expect(component.dataSource.data.length).toBe(2);
    });

    it('should ignore null input', () => {
      // Arrange: Set initial data
      component.lineItems = mockLineItems;
      
      // Act: Set null
      component.lineItems = null;

      // Assert: Data should remain or be handled based on component logic (current logic ignores null)
      expect(component.dataSource.data).toEqual(mockLineItems);
    });
  });

  describe('Sorting Logic (Custom Accessor)', () => {
    beforeEach(() => {
      component.lineItems = mockLineItems;
      fixture.detectChanges();
    });

    it('should sort by nested "productName"', () => {
      // The component defines a custom sortingDataAccessor in configureSorting()
      const accessor = component.dataSource.sortingDataAccessor;
      const item = mockLineItems[0]; // 'Alpha Product'

      // Act
      const result = accessor(item, 'productName');

      // Assert
      expect(result).toBe('Alpha Product');
    });

    it('should sort by standard properties (e.g., cost)', () => {
      const accessor = component.dataSource.sortingDataAccessor;
      const item = mockLineItems[0]; // Cost: 100

      // Act
      const result = accessor(item, 'cost');

      // Assert
      expect(result).toBe(100);
    });

    it('should handle undefined nested properties gracefully', () => {
      const accessor = component.dataSource.sortingDataAccessor;
      // Create a partial object simulating missing product
      const item = { ...mockLineItems[0], product: undefined } as unknown as ProductLineItem;

      // Act
      const result = accessor(item, 'productName');

      // Assert
      expect(result).toBe('');
    });
  });

  describe('User Interaction', () => {
    beforeEach(() => {
      // Setup data and render rows
      component.lineItems = mockLineItems;
      fixture.detectChanges();
    });

    it('should emit editLineItem when edit button is clicked', () => {
      // Arrange
      const emitSpy = spyOn(component.editLineItem, 'emit');
      // Query the first row's primary color button (Edit)
      const editBtn = fixture.debugElement.query(By.css('button[color="primary"]'));

      // Act
      editBtn.triggerEventHandler('click', null);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(mockLineItems[0]);
    });

    it('should emit deleteLineItem when delete button is clicked', () => {
      // Arrange
      const emitSpy = spyOn(component.deleteLineItem, 'emit');
      // Query the first row's warn color button (Delete)
      const deleteBtn = fixture.debugElement.query(By.css('button[color="warn"]'));

      // Act
      deleteBtn.triggerEventHandler('click', null);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(mockLineItems[0]);
    });
  });

  describe('View Initialization', () => {
    it('should attach paginator and sort to dataSource after view init', () => {
      // ngAfterViewInit runs automatically after the first detectChanges in beforeEach
      expect(component.dataSource.paginator).toBeTruthy();
      expect(component.dataSource.sort).toBeTruthy();
    });
  });
});