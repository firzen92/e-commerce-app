import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AUTH_SERVICE, MockAuthService } from '../services';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let authService: MockAuthService;

  beforeEach(() => {
    authService = new MockAuthService();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AUTH_SERVICE, useValue: authService }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('attaches the access token to requests bound for the API', () => {
    authService.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe();

    httpClient.get(`${environment.apiBaseUrl}/products`).subscribe();

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/products`);
    expect(request.request.headers.get('Authorization')).toBe('Bearer mock-access-token');
    request.flush([]);
  });

  it('does not attach a token when signed out', () => {
    httpClient.get(`${environment.apiBaseUrl}/products`).subscribe();

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/products`);
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush([]);
  });

  it('leaves requests to other origins untouched', () => {
    authService.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe();

    httpClient.get('https://images.example.com/logo.png').subscribe();

    const request = httpTesting.expectOne('https://images.example.com/logo.png');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });
});
