import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { authGuard } from './auth.guard';
import { AUTH_SERVICE, MockAuthService } from '../services';

describe('authGuard', () => {
  let authService: MockAuthService;

  beforeEach(() => {
    authService = new MockAuthService();

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AUTH_SERVICE, useValue: authService }]
    });
  });

  function runGuard(): Observable<boolean | UrlTree> {
    return TestBed.runInInjectionContext(
      () => authGuard({} as never, { url: '/orders' } as never) as Observable<boolean | UrlTree>
    );
  }

  it('allows navigation when a user is signed in', async () => {
    authService.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe();

    const result = await firstValueFrom(runGuard());
    expect(result).toBe(true);
  });

  it('redirects to /login with a returnUrl when signed out', async () => {
    const result = await firstValueFrom(runGuard());

    expect(result).not.toBe(true);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe(
      '/login?returnUrl=%2Forders'
    );
  });
});
