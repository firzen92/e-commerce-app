import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../../../app.routes';
import { Product } from '../../../../models';
import { CartService } from '../../../../state/cart.service';
import { Cart } from './cart';

function buildProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1',
    slug: 'aria-lounge-chair',
    name: 'Aria Lounge Chair',
    description: 'A sculptural lounge chair.',
    price: { amount: 100, currency: 'USD' },
    categoryId: 'cat-1',
    images: [{ url: 'https://example.com/chair.jpg', alt: 'Aria Lounge Chair' }],
    inventory: { inStock: true, quantity: 5 },
    createdAt: '2025-11-02T00:00:00.000Z',
    ...overrides
  };
}

describe('Cart', () => {
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cart],
      providers: [provideRouter(routes)]
    }).compileComponents();

    cartService = TestBed.inject(CartService);
  });

  it('shows an empty state with no items in the cart', async () => {
    const fixture = TestBed.createComponent(Cart);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.cart-page__empty')?.textContent).toContain('Your cart is empty');
  });

  it('lists each cart item with its quantity and subtotal', async () => {
    cartService.addItem(buildProduct(), 2);

    const fixture = TestBed.createComponent(Cart);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.cart-page__item').length).toBe(1);
    expect(compiled.querySelector('.cart-page__quantity-value')?.textContent).toContain('2');
    expect(compiled.querySelector('.cart-page__subtotal')?.textContent).toContain('$200');
  });

  it('increases the quantity when the + stepper is clicked', async () => {
    cartService.addItem(buildProduct(), 1);

    const fixture = TestBed.createComponent(Cart);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const [, incrementButton] = Array.from(compiled.querySelectorAll<HTMLButtonElement>('.cart-page__quantity button'));
    incrementButton.click();
    await fixture.whenStable();

    expect(cartService.items()[0].quantity).toBe(2);
  });

  it('removes an item from the cart', async () => {
    cartService.addItem(buildProduct(), 1);

    const fixture = TestBed.createComponent(Cart);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.cart-page__remove') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(cartService.items()).toEqual([]);
    expect(compiled.querySelector('.cart-page__empty')).not.toBeNull();
  });

  it('reveals a checkout notice when Checkout is clicked', async () => {
    cartService.addItem(buildProduct(), 1);

    const fixture = TestBed.createComponent(Cart);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.cart-page__checkout-notice')).toBeNull();

    (compiled.querySelector('.cart-page__checkout') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(compiled.querySelector('.cart-page__checkout-notice')?.textContent).toContain('Checkout is coming soon');
  });
});
