import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/Components/nav-bar/nav-bar.component';
import { By } from '@angular/platform-browser';

// 1. Mock the Child Component
// We mock this to avoid errors related to NavBarComponent's dependencies (e.g. AuthService)
@Component({
  selector: 'pos-nav-bar',
  standalone: true, // Angular 19 / Standalone compatible
  template: '<div>Mock Nav Bar</div>'
})
class MockNavBarComponent {}

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Import the component under test
      imports: [MainLayoutComponent]
    })
    // 2. Override the component's imports to use the Mock instead of the Real NavBar
    .overrideComponent(MainLayoutComponent, {
      remove: { imports: [NavBarComponent] },
      add: { imports: [MockNavBarComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    
    // Trigger initial data binding
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the navigation bar', () => {
    // strict check using CSS selector from the template
    const navBar = fixture.debugElement.query(By.css('pos-nav-bar'));
    expect(navBar).toBeTruthy();
  });

  it('should contain the main container class', () => {
    const container = fixture.debugElement.query(By.css('.main-container'));
    expect(container).toBeTruthy();
  });
});