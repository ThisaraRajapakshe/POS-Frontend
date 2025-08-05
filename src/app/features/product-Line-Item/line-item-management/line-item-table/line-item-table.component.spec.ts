import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineItemTableComponent } from './line-item-table.component';

describe('LineItemTableComponent', () => {
  let component: LineItemTableComponent;
  let fixture: ComponentFixture<LineItemTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineItemTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineItemTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
