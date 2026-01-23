import { TestBed } from '@angular/core/testing'; // Removed fakeAsync, tick
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Services and Models
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { environment } from '../../../../environments/environment';
import { UserProfile } from '../../models/Domains/UserProfile';
import { LoginRequest, LoginResponse, TokenResponse } from '../../models/Domains/auth.types';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  // Mocks
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let routerSpy: jasmine.SpyObj<Router>;

  // Helper to generate a dummy JWT with a specific expiration time (in seconds from now)
  const createMockJwt = (expiresInSeconds: number): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    // Date.now() is ms, jwt exp is seconds
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const payload = btoa(JSON.stringify({ sub: '123', name: 'Test User', exp: exp }));
    return `${header}.${payload}.signature`;
  };

  const mockUser: UserProfile = { id: '1', fullName: 'John Doe', email: 'john@example.com' } as UserProfile;

  beforeEach(() => {
    // 1. Create Mocks
    tokenServiceSpy = jasmine.createSpyObj('TokenService', [
      'getAccessToken',
      'getRefreshToken',
      'storeTokens',
      'clearTokens'
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // 2. Configure TestBed
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        // Modern HTTP Testing
        provideHttpClient(),
        provideHttpClientTesting(),
        // Dependency Mocks
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    // We do NOT inject the service here immediately if we want to test constructor logic
    // dependent on specific token states (like auto-login).
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // --- TEST: Construction & Initialization ---

  it('should be created', () => {
    service = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });

  it('should initialize with NO user if no token is present', () => {
    tokenServiceSpy.getAccessToken.and.returnValue(null);

    service = TestBed.inject(AuthService);

    service.currentUser$.subscribe(user => {
      expect(user).toBeNull();
    });
  });

  it('should attempt to fetch user profile on init if token exists', () => {
    // Arrange: Token exists BEFORE service is created
    tokenServiceSpy.getAccessToken.and.returnValue('valid-token');

    // Act
    service = TestBed.inject(AuthService);

    // Assert: Expect the constructor to trigger a GET request
    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/profile`);
    expect(req.request.method).toBe('GET');

    // Respond to request
    req.flush(mockUser);

    // Verify state updated
    service.currentUser$.subscribe(user => {
      expect(user).toEqual(mockUser);
    });
  });

  // --- TEST: Login ---

  it('should login, store tokens, and fetch profile', () => {
    // Arrange
    tokenServiceSpy.getAccessToken.and.returnValue(null); // Initially logged out
    service = TestBed.inject(AuthService);
    
    const loginCreds: LoginRequest = { username: 'test@test.com', password: '123' };
    
    // FIX: Changed expiresAt to a real Date object to match interface
    const mockAuthResponse: LoginResponse = { 
      accessToken: 'abc', 
      refreshToken: 'xyz', 
      expiresAt: new Date(Date.now() + 3600 * 1000), 
      roles: ['admin']
    };

    // Act
    service.login(loginCreds).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    // Assert 1: Login POST request
    const loginReq = httpTestingController.expectOne(`${environment.apiUrl}/auth/login`);
    expect(loginReq.request.method).toBe('POST');
    loginReq.flush(mockAuthResponse);

    // Assert 2: Verify tokens were stored
    expect(tokenServiceSpy.storeTokens).toHaveBeenCalledWith('abc', 'xyz');

    // Assert 3: Profile GET request (triggered by switchMap)
    const profileReq = httpTestingController.expectOne(`${environment.apiUrl}/auth/profile`);
    expect(profileReq.request.method).toBe('GET');
    profileReq.flush(mockUser);
  });

  // --- TEST: Logout ---

  it('should logout, call server, and cleanup state', () => {
    service = TestBed.inject(AuthService);
    
    // IMPORTANT: Spy on the private method `clearTokensAndNavigate` to prevent
    // window.location.href from actually reloading the page during the test.
    const cleanupSpy = spyOn(
      service as unknown as {'clearTokensAndNavigate': () => void},
       'clearTokensAndNavigate').
       and.callFake(() => {
      // Manually call the safe part (clearing tokens) if needed, or just verify the call.
      // We will just verify it was called.
    });

    // Act
    service.logout();

    // Assert 1: Server logout call
    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({});

    // Assert 2: Cleanup was triggered
    expect(cleanupSpy).toHaveBeenCalled();
  });

  it('should perform client-side cleanup even if server logout fails', () => {
    service = TestBed.inject(AuthService);
    const cleanupSpy = spyOn(
      service as unknown as {'clearTokensAndNavigate': () => void},
      'clearTokensAndNavigate'
    ).and.stub();

    // Act
    service.logout();

    // Assert
    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/logout`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    // Should still call cleanup
    expect(cleanupSpy).toHaveBeenCalled();
  });

  // --- TEST: IsLoggedIn (Token Logic) ---

  it('should return true if token exists and is valid', () => {
    const validToken = createMockJwt(3600); // Expires in 1 hour
    tokenServiceSpy.getAccessToken.and.returnValue(validToken);
    service = TestBed.inject(AuthService);

    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if token is expired', () => {
    const expiredToken = createMockJwt(-3600); // Expired 1 hour ago
    tokenServiceSpy.getAccessToken.and.returnValue(expiredToken);
    service = TestBed.inject(AuthService);

    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should return false if no token exists', () => {
    tokenServiceSpy.getAccessToken.and.returnValue(null);
    service = TestBed.inject(AuthService);

    expect(service.isLoggedIn()).toBeFalse();
  });

  // --- TEST: Refresh Token ---

  it('should refresh tokens successfully', () => {
    service = TestBed.inject(AuthService);
    tokenServiceSpy.getAccessToken.and.returnValue('old-access');
    tokenServiceSpy.getRefreshToken.and.returnValue('old-refresh');

    const mockRefreshResponse: TokenResponse = { accessToken: 'new-access', refreshToken: 'new-refresh' };

    // Act
    service.refreshToken().subscribe();

    // Assert
    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/refresh`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ accessToken: 'old-access', refreshToken: 'old-refresh' });
    
    req.flush(mockRefreshResponse);

    expect(tokenServiceSpy.storeTokens).toHaveBeenCalledWith('new-access', 'new-refresh');
  });

  it('should throw error if tokens are missing during refresh', () => {
    service = TestBed.inject(AuthService);
    tokenServiceSpy.getAccessToken.and.returnValue(null);

    service.refreshToken().subscribe({
      next: () => fail('Should have failed'),
      error: (err) => {
        expect(err.message).toBe('No refresh token available');
      }
    });

    httpTestingController.expectNone(`${environment.apiUrl}/auth/refresh`);
  });
});