import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Product } from '../../../models';
import {
  AUTH_SERVICE,
  MockAuthService,
  MockWishlistService,
  WISHLIST_SERVICE
} from '../../../core/services';
import { ProductCard } from './product-card';

const product: Product = {
  id: 'prod-1',
  slug: 'aria-lounge-chair',
  name: 'Aria Lounge Chair',
  description: 'A sculptural lounge chair.',
  price: { amount: 649, currency: 'USD' },
  categoryId: 'cat-1',
  images: [{ url: 'https://example.com/chair.jpg', alt: 'Aria Lounge Chair' }],
  rating: { average: 4.8, count: 214 },
  inventory: { inStock: true, quantity: 18 },
  createdAt: '2025-11-02T00:00:00.000Z'
};

describe('ProductCard', () => {
  let authService: MockAuthService;
  let wishlistService: MockWishlistService;

  beforeEach(async () => {
    authService = new MockAuthService();
    wishlistService = new MockWishlistService();

    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [
        provideRouter([{ path: 'login', children: [] }]),
        { provide: AUTH_SERVICE, useValue: authService },
        { provide: WISHLIST_SERVICE, useValue: wishlistService }
      ]
    }).compileComponents();
  });

  it('links the whole card to its product detail page', async () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', product);
    await fixture.whenStable();

    const link = fixture.nativeElement.querySelector('.product-card__stretched-link') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/products/aria-lounge-chair');
    expect(link.getAttribute('aria-label')).toBe('Aria Lounge Chair');
  });

  it('stacks the full-card link above the media block but below the wishlist button', async () => {
    // Regression test for the link being painted underneath .product-card__media (which has
    // its own position: relative for the sale/new badge), so only the plain-text name/price
    // area — outside that positioned block — was actually clickable.
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', product);
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    const link = host.querySelector('.product-card__stretched-link') as HTMLElement;
    const media = host.querySelector('.product-card__media') as HTMLElement;
    const wishlist = host.querySelector('.product-card__wishlist') as HTMLElement;

    const zIndexOf = (el: HTMLElement) => Number.parseInt(getComputedStyle(el).zIndex, 10) || 0;

    expect(zIndexOf(link)).toBeGreaterThan(zIndexOf(media));
    expect(zIndexOf(wishlist)).toBeGreaterThan(zIndexOf(link));
  });

  it('redirects a signed-out shopper to login instead of adding to the wishlist', async () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', product);
    await fixture.whenStable();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const wishlistButton = fixture.nativeElement.querySelector('.product-card__wishlist') as HTMLButtonElement;
    wishlistButton.click();
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith(['/login'], expect.objectContaining({ queryParams: expect.anything() }));
    expect(wishlistService.items()).toEqual([]);
  });

  it('toggles a signed-in shopper product in and out of the wishlist', async () => {
    authService.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe();

    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', product);
    await fixture.whenStable();

    const wishlistButton = fixture.nativeElement.querySelector('.product-card__wishlist') as HTMLButtonElement;

    wishlistButton.click();
    await fixture.whenStable();
    expect(wishlistService.items()?.map((item) => item.product.id)).toEqual(['prod-1']);
    expect(wishlistButton.getAttribute('aria-pressed')).toBe('true');

    wishlistButton.click();
    await fixture.whenStable();
    expect(wishlistService.items()).toEqual([]);
    expect(wishlistButton.getAttribute('aria-pressed')).toBe('false');
  });
});
