import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSalesComponent } from './pos-sales.component';

describe('PosSalesComponent', () => {
  let component: PosSalesComponent;
  let fixture: ComponentFixture<PosSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
