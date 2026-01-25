import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceiptComponent } from './receipt.component';
import { By } from '@angular/platform-browser';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Order, OrderStatus } from '../../models';

describe('ReceiptComponent', () => {
  let component: ReceiptComponent;
  let fixture: ComponentFixture<ReceiptComponent>;

  // ✅ FIXED: Mock Data matches your Order Interface
  const mockOrder: Order = {
    id: 'test-id-123',
    orderNumber: 'ORD-2026-001',
    orderDate: new Date('2026-01-25T10:00:00'),
    totalAmount: 5000.00,
    items: [
      // Item 0: Gaming Mouse
      { name: 'Gaming Mouse', quantity: 2, price: 1500.00, total: 3000.00 },
      // Item 1: Keyboard
      { name: 'Mechanical Keyboard', quantity: 1, price: 2000.00, total: 2000.00 }
    ],
    status: OrderStatus.Completed,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptComponent],
      providers: [DatePipe, DecimalPipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.orderData = mockOrder;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT render the receipt container when orderData is null', () => {
    component.orderData = null;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('#invoice-POS'));
    expect(container).toBeNull();
  });

  it('should render the receipt container when orderData is provided', () => {
    component.orderData = mockOrder;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('#invoice-POS'));
    expect(container).not.toBeNull();
  });

  it('should display the correct Order Number and Total', () => {
    component.orderData = mockOrder;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    
    // 1. Check Order Number
    expect(compiled.textContent).toContain('ORD-2026-001');
    
    // 2. Check Total Amount
    // The mock total is 5000.00.
    // Ensure this matches the exact spacing in your HTML (e.g., "Rs.5,000.00" or "Rs. 5,000.00")
    // Based on your previous code "Rs.{{val}}", it's likely without space, but we check for the number.
    expect(compiled.textContent).toContain('5,000.00'); 
  });

  it('should render a table row for each item', () => {
    component.orderData = mockOrder;
    fixture.detectChanges();

    const itemRows = fixture.debugElement.queryAll(By.css('.service'));
    expect(itemRows.length).toBe(2);
  });

  it('should display item details correctly in the table', () => {
    component.orderData = mockOrder;
    fixture.detectChanges();

    const itemRows = fixture.debugElement.queryAll(By.css('.service'));
    const firstRow = itemRows[0].nativeElement.textContent;

    // ✅ FIXED: Matches the "Gaming Mouse" data in mockOrder
    expect(firstRow).toContain('Gaming Mouse'); 
    
    // Quantity was 2 in mock, so we expect '2', not '1'
    expect(firstRow).toContain('2'); 
    
    // The receipt shows the LINE TOTAL (Qty * Price)
    // 2 * 1500 = 3000. So we expect 3,000.00
    expect(firstRow).toContain('3,000.00'); 
  });
});