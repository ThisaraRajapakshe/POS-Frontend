import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyDetailedReportComponent } from './monthly-detailed-report.component';

describe('MonthlyDetailedReportComponent', () => {
  let component: MonthlyDetailedReportComponent;
  let fixture: ComponentFixture<MonthlyDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyDetailedReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
