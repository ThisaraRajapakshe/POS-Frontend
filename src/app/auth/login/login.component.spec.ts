import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../Core/services/auth/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { UserProfile } from '../../Core/models/Domains/UserProfile';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // 1. Define Typed Spies (No 'any')
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // 2. Create Mocks
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, // Standalone Component
        ReactiveFormsModule,
        NoopAnimationsModule // Critical for Material Components
      ],
      providers: [
        // 3. Provide Mocks (Breaks the dependency on real HttpClient)
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.loginForm.valid).toBeFalse();
    });

    it('should be valid when filled correctly', () => {
      component.loginForm.controls['username'].setValue('admin');
      component.loginForm.controls['password'].setValue('1234');
      expect(component.loginForm.valid).toBeTrue();
    });

    it('should NOT call login if form is invalid', () => {
      // Act: Try to submit empty form
      component.onSubmit();

      // Assert: Service should not be touched
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });
  });

  describe('Login Logic', () => {
    it('should navigate to home on successful login', () => {
      // Arrange
      const credentials = { username: 'user', password: 'pass' };
      component.loginForm.setValue(credentials);
      
      const mockUser: UserProfile = {
        id: '1',
        userName: 'user',
        email: 'user@example.com',
        fullName: 'Test User',
        branchId: 'B001',
        branchName: 'Main Branch',
        employeeId: null,
        isActive: true,
        createdAt: '2023-01-01',
        lastLoginAt: null,
        roles: ['User']
      };

      // Mock Success Response (Return an observable)
      authServiceSpy.login.and.returnValue(of(mockUser));

      // Act
      component.onSubmit();

      // Assert
      expect(authServiceSpy.login).toHaveBeenCalledWith(credentials);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
      expect(component.errorMessage).toBeNull();
    });

    it('should display error message on login failure', () => {
      // Arrange
      component.loginForm.setValue({ username: 'user', password: 'wrong-pass' });
      
      // Mock Error Response
      authServiceSpy.login.and.returnValue(throwError(() => new Error('Unauthorized')));

      // Act
      component.onSubmit();

      // Assert
      expect(authServiceSpy.login).toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled(); // Should stay on page
      expect(component.errorMessage).toBe('Login failed. Please try again.');
    });
  });
});