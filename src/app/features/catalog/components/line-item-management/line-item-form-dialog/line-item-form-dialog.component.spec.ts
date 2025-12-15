import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineItemFormDialogComponent } from './line-item-form-dialog.component';

describe('LineItemFormDialogComponent', () => {
  let component: LineItemFormDialogComponent;
  let fixture: ComponentFixture<LineItemFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineItemFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineItemFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
