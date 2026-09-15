import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { routes } from '../../../../app.routes';
import { AUTH_SERVICE, MockAuthService, ORDERS_SERVICE } from '../../../../core/services';
import { OrdersService } from '../../../../core/interfaces';
import { Order, Product } from '../../../../models';
import { CartService } from '../../../../state/cart.service';
import { Cart } from './cart';

function buildOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'order-1',
    status: 'pending',
    lineItems: [],
    total: { amount: 200, currency: 'USD' },
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides
  };
}

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
  let authService: MockAuthService;
  let ordersService: { placeOrder: ReturnType<typeof vi.fn<OrdersService['placeOrder']>> };

  beforeEach(async () => {
    authService = new MockAuthService();
    ordersService = { placeOrder: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Cart],
      providers: [
        provideRouter(routes),
        { provide: AUTH_SERVICE, useValue: authService },
        { provide: ORDERS_SERVICE, useValue: ordersService }
      ]
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

  it('redirects a signed-out shopper to login instead of placing an order', async () => {
    cartService.addItem(buildProduct(), 1);

    const fixture = TestBed.createComponent(Cart);
    await fixture.whenStable();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    (fixture.nativeElement.querySelector('.cart-page__checkout') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/cart' } });
    expect(ordersService.placeOrder).not.toHaveBeenCalled();
    expect(cartService.items().length).toBe(1);
  });

  it('places an order and clears the cart for a signed-in shopper', async () => {
    authService.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe();
    cartService.addItem(buildProduct(), 2);
    ordersService.placeOrder.mockReturnValue(of(buildOrder()));

    const fixture = TestBed.createComponent(Cart);
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('.cart-page__checkout') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(ordersService.placeOrder).toHaveBeenCalledWith([{ productId: 'prod-1', quantity: 2 }]);
    expect(cartService.items()).toEqual([]);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.cart-page__confirmation')?.textContent).toContain('order-1');
  });

  it('shows an error and keeps the cart when placing the order fails', async () => {
    authService.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe();
    cartService.addItem(buildProduct(), 1);
    ordersService.placeOrder.mockReturnValue(throwError(() => new Error('network error')));

    const fixture = TestBed.createComponent(Cart);
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('.cart-page__checkout') as HTMLButtonElement).click();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.cart-page__checkout-notice')?.textContent).toContain(
      "couldn't place your order"
    );
    expect(cartService.items().length).toBe(1);
  });
});
