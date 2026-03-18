import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockClerkDashboardComponent } from './stock-clerk-dashboard.component';

describe('StockClerkDashboardComponent', () => {
  let component: StockClerkDashboardComponent;
  let fixture: ComponentFixture<StockClerkDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockClerkDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockClerkDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
