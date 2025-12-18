import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineItemManagementComponent } from './line-item-management.component';

describe('LineItemManagementComponent', () => {
  let component: LineItemManagementComponent;
  let fixture: ComponentFixture<LineItemManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineItemManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineItemManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
