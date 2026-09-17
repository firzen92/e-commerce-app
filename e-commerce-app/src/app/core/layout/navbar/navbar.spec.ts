import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../../app.routes';
import { AUTH_SERVICE, MockAuthService, MockWishlistService, WISHLIST_SERVICE } from '../../services';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let authService: MockAuthService;

  beforeEach(async () => {
    authService = new MockAuthService();

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter(routes),
        { provide: AUTH_SERVICE, useValue: authService },
        { provide: WISHLIST_SERVICE, useClass: MockWishlistService }
      ]
    }).compileComponents();
  });

  it('shows a sign-in link when signed out', async () => {
    const fixture = TestBed.createComponent(Navbar);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[aria-label="Sign in"]')).not.toBeNull();
    expect(compiled.querySelector('button[aria-label="Account menu"]')).toBeNull();
  });

  it('shows the account menu trigger when signed in', async () => {
    authService.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe();

    const fixture = TestBed.createComponent(Navbar);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button[aria-label="Account menu"]')).not.toBeNull();
    expect(compiled.querySelector('a[aria-label="Sign in"]')).toBeNull();
  });

  it('opens an inline search field and navigates to the search page on submit', async () => {
    const fixture = TestBed.createComponent(Navbar);
    await fixture.whenStable();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('button[aria-label="Search products"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    const input = compiled.querySelector('input[aria-label="Search products"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    input.value = 'lamp';
    (compiled.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { cancelable: true })
    );

    expect(navigateSpy).toHaveBeenCalledWith(['/search'], { queryParams: { q: 'lamp' } });
  });
});
