import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';

// Import your artifacts
import { authInterceptor } from './auth.interceptor'; // Adjust path
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/auth/token.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  
  // Mocks
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  
  // We need a real Subject to test the reactive queueing logic in the interceptor
  let refreshTokenSubject: BehaviorSubject<string | null>;

  beforeEach(() => {
    // 1. Setup Mocks
    refreshTokenSubject = new BehaviorSubject<string | null>(null);

    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getIsRefreshing',
      'setIsRefreshing',
      'getRefreshTokenSubject',
      'refreshToken',
      'logout'
    ]);

    // Default mock behaviors
    authServiceSpy.getRefreshTokenSubject.and.returnValue(refreshTokenSubject);
    authServiceSpy.getIsRefreshing.and.returnValue(false);
    authServiceSpy.refreshToken.and.returnValue(of({ accessToken: 'new-refreshed-token', refreshToken: 'r-token' }));

    tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getAccessToken']);

    // 2. Configure TestBed
    TestBed.configureTestingModule({
      providers: [
        // The Modern Angular 16+ way to test functional interceptors
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        
        // Provide Mocks
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TokenService, useValue: tokenServiceSpy }
      ]
    });

    // 3. Inject Services
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify no outstanding requests remain
    httpTestingController.verify();
  });

  // --- TEST CASE 1: Authorization Header ---
  it('should add an Authorization header when token is present', () => {
    // Arrange
    const testToken = 'test-jwt-token';
    tokenServiceSpy.getAccessToken.and.returnValue(testToken);

    // Act
    httpClient.get('/api/data').subscribe();

    // Assert
    const req = httpTestingController.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    
    req.flush({}); // Complete the request
  });

  // --- TEST CASE 2: No Header ---
  it('should NOT add Authorization header when token is missing', () => {
    // Arrange
    tokenServiceSpy.getAccessToken.and.returnValue(null);

    // Act
    httpClient.get('/api/data').subscribe();

    // Assert
    const req = httpTestingController.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    
    req.flush({});
  });

  // --- TEST CASE 3: 401 Handling & Refresh Logic ---
  
  describe('401 Error Handling', () => {
    
    it('should attempt to refresh token on 401 error and retry request', () => {
      // Arrange
      const initialToken = 'expired-token';
      const newToken = 'new-refreshed-token';
      
      tokenServiceSpy.getAccessToken.and.returnValue(initialToken);
      
      // Act: Make initial request
      httpClient.get('/api/protected').subscribe(response => {
        expect(response).toBeTruthy();
      });

      // Assert 1: Interceptor catches the initial request
      const initialReq = httpTestingController.expectOne('/api/protected');
      expect(initialReq.request.headers.get('Authorization')).toBe(`Bearer ${initialToken}`);
      
      // Act: Simulate 401 from backend
      initialReq.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      // Assert 2: Verify refresh flow was triggered
      expect(authServiceSpy.setIsRefreshing).toHaveBeenCalledWith(true);
      expect(authServiceSpy.refreshToken).toHaveBeenCalled();

      // Assert 3: Expect the Retry request with the NEW token
      const retryReq = httpTestingController.expectOne('/api/protected');
      expect(retryReq.request.headers.get('Authorization')).toBe(`Bearer ${newToken}`);
      
      // Complete the retry
      retryReq.flush({ data: 'success' });
      
      // Cleanup check
      expect(authServiceSpy.setIsRefreshing).toHaveBeenCalledWith(false);
    });

    it('should NOT attempt refresh for IGNORED_URLS (e.g., login) and pass error through', () => {
      // Arrange
      tokenServiceSpy.getAccessToken.and.returnValue(null);
      const loginUrl = '/auth/login';

      // Act
      httpClient.post(loginUrl, { user: 'test' }).subscribe({
        next: () => fail('Should have errored'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
        }
      });

      // Assert
      const req = httpTestingController.expectOne(loginUrl);
      req.flush('Invalid Creds', { status: 401, statusText: 'Unauthorized' });

      // Ensure refresh logic was NOT called
      expect(authServiceSpy.refreshToken).not.toHaveBeenCalled();
    });

    it('should logout if refresh token fails', () => {
      // Arrange
      tokenServiceSpy.getAccessToken.and.returnValue('expired-token');
      // Simulate refresh failure
      authServiceSpy.refreshToken.and.returnValue(throwError(() => new Error('Refresh Expired')));

      // Act
      httpClient.get('/api/data').subscribe({
        next: () => fail('Should have errored'),
        error: (err) => {
          expect(err).toBeTruthy();
        }
      });

      const req = httpTestingController.expectOne('/api/data');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      // Assert
      expect(authServiceSpy.logout).toHaveBeenCalled();
      expect(authServiceSpy.setIsRefreshing).toHaveBeenCalledWith(false);
    });

    it('should queue requests if refreshing is already in progress', () => {
      // Arrange
      tokenServiceSpy.getAccessToken.and.returnValue('expired-token');
      // Simulate another request is already refreshing the token
      authServiceSpy.getIsRefreshing.and.returnValue(true);

      // Act
      httpClient.get('/api/queued-request').subscribe();

      const req = httpTestingController.expectOne('/api/queued-request');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      // Assert: Refresh should NOT be called again
      expect(authServiceSpy.refreshToken).not.toHaveBeenCalled();

      // Act: Simulate the "other" request finishing and emitting the new token
      refreshTokenSubject.next('queued-token-result');

      // Assert: The queued request should now fire with the token from the subject
      const retryReq = httpTestingController.expectOne('/api/queued-request');
      expect(retryReq.request.headers.get('Authorization')).toBe('Bearer queued-token-result');
      
      retryReq.flush({});
    });
  });
});