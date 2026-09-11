import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Product } from '../../../models';
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
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([])]
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
});
