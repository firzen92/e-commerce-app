import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';
import { routes } from '../../../../app.routes';
import { ORDERS_SERVICE } from '../../../../core/services';
import { Order, Product } from '../../../../models';
import { OrderHistory } from './order-history';

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

function buildOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'order-1',
    status: 'pending',
    lineItems: [
      { productId: 'prod-1', quantity: 2, unitPrice: { amount: 100, currency: 'USD' }, product: buildProduct() }
    ],
    total: { amount: 200, currency: 'USD' },
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides
  };
}

describe('OrderHistory', () => {
  async function setup(ordersService: { listOrders: () => Observable<Order[]> }) {
    await TestBed.configureTestingModule({
      imports: [OrderHistory],
      providers: [provideRouter(routes), { provide: ORDERS_SERVICE, useValue: ordersService }]
    }).compileComponents();

    const fixture = TestBed.createComponent(OrderHistory);
    await fixture.whenStable();
    return fixture;
  }

  it('shows a loading state while the fetch is in flight', async () => {
    const pending = new Subject<Order[]>();
    const fixture = await setup({ listOrders: () => pending });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="status"]')?.textContent).toContain('Loading your orders');
  });

  it('shows an empty state with no orders', async () => {
    const fixture = await setup({ listOrders: () => of([]) });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.order-history-page__empty')?.textContent).toContain(
      "haven't placed any orders"
    );
  });

  it('shows an error state when the fetch fails', async () => {
    const fixture = await setup({ listOrders: () => throwError(() => new Error('network error')) });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="alert"]')?.textContent).toContain("couldn't load your orders");
  });

  it('lists each order with its line items, status, and total', async () => {
    const fixture = await setup({ listOrders: () => of([buildOrder()]) });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.order-history-page__order').length).toBe(1);
    expect(compiled.querySelector('.order-history-page__status-badge')?.textContent).toContain('pending');
    expect(compiled.querySelector('.order-history-page__item-name')?.textContent).toContain('Aria Lounge Chair');
    expect(compiled.querySelector('.order-history-page__item-quantity')?.textContent).toContain('2');
    expect(compiled.querySelector('.order-history-page__order-total')?.textContent).toContain('$200');
  });

  it('shows a placeholder for a line item whose product has been deleted', async () => {
    const order = buildOrder({
      lineItems: [{ productId: 'prod-deleted', quantity: 1, unitPrice: { amount: 50, currency: 'USD' }, product: null }]
    });
    const fixture = await setup({ listOrders: () => of([order]) });

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.order-history-page__item-name--unavailable')?.textContent).toContain(
      'no longer available'
    );
  });
});
