import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  // Define a type to safely cast the service and access private constants
  // This ensures our test uses the actual keys defined in the class, not hardcoded strings
  interface TokenServicePrivate {
    TOKEN_KEY: string;
    REFRESH_TOKEN_KEY: string;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TokenService,
        // Included as per requirements, even though this specific service 
        // acts on LocalStorage and doesn't directly consume HttpClient.
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('storeTokens', () => {
    it('should store access and refresh tokens in localStorage', () => {
      // Arrange
      const setItemSpy = spyOn(localStorage, 'setItem');
      const accessToken = 'mock-access-token';
      const refreshToken = 'mock-refresh-token';
      
      // Access private constants via strict casting
      const privateService = service as unknown as TokenServicePrivate;

      // Act
      service.storeTokens(accessToken, refreshToken);

      // Assert
      expect(setItemSpy).toHaveBeenCalledWith(privateService.TOKEN_KEY, accessToken);
      expect(setItemSpy).toHaveBeenCalledWith(privateService.REFRESH_TOKEN_KEY, refreshToken);
    });
  });

  describe('getAccessToken', () => {
    it('should return the token from localStorage', () => {
      // Arrange
      const mockToken = 'stored-access-token';
      const privateService = service as unknown as TokenServicePrivate;
      
      const getItemSpy = spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === privateService.TOKEN_KEY) return mockToken;
        return null;
      });

      // Act
      const result = service.getAccessToken();

      // Assert
      expect(getItemSpy).toHaveBeenCalledWith(privateService.TOKEN_KEY);
      expect(result).toBe(mockToken);
    });

    it('should return null if no token exists', () => {
      // Arrange
      spyOn(localStorage, 'getItem').and.returnValue(null);

      // Act
      const result = service.getAccessToken();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('should return the refresh token from localStorage', () => {
      // Arrange
      const mockRefreshToken = 'stored-refresh-token';
      const privateService = service as unknown as TokenServicePrivate;

      const getItemSpy = spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === privateService.REFRESH_TOKEN_KEY) return mockRefreshToken;
        return null;
      });

      // Act
      const result = service.getRefreshToken();

      // Assert
      expect(getItemSpy).toHaveBeenCalledWith(privateService.REFRESH_TOKEN_KEY);
      expect(result).toBe(mockRefreshToken);
    });
  });

  describe('clearTokens', () => {
    it('should remove both tokens from localStorage', () => {
      // Arrange
      const removeItemSpy = spyOn(localStorage, 'removeItem');
      const privateService = service as unknown as TokenServicePrivate;

      // Act
      service.clearTokens();

      // Assert
      expect(removeItemSpy).toHaveBeenCalledWith(privateService.TOKEN_KEY);
      expect(removeItemSpy).toHaveBeenCalledWith(privateService.REFRESH_TOKEN_KEY);
    });
  });
});