import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../../../app.routes';
import { AUTH_SERVICE, MockAuthService, MockWishlistService, WISHLIST_SERVICE } from '../../../../core/services';
import { Wishlist } from './wishlist';

describe('Wishlist', () => {
  let wishlistService: MockWishlistService;

  beforeEach(async () => {
    wishlistService = new MockWishlistService();

    await TestBed.configureTestingModule({
      imports: [Wishlist],
      providers: [
        provideRouter(routes),
        { provide: AUTH_SERVICE, useClass: MockAuthService },
        { provide: WISHLIST_SERVICE, useValue: wishlistService }
      ]
    }).compileComponents();
  });

  it('shows an empty state with no wishlist items', async () => {
    const fixture = TestBed.createComponent(Wishlist);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.wishlist-page__empty')?.textContent).toContain('Nothing here yet');
  });

  it('lists each wishlisted product', async () => {
    await new Promise((resolve) => wishlistService.add('prod-1').subscribe(resolve));

    const fixture = TestBed.createComponent(Wishlist);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-product-card').length).toBe(1);
  });
});
