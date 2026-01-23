import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        // Angular 19 way to provide Router dependency for <router-outlet>
        provideRouter([]) 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'pos' title`, () => {
    expect(component.title).toEqual('pos');
  });

  it('should render the router-outlet', () => {
    // Query by Directive to ensure the Angular RouterOutlet is actually active
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });
});