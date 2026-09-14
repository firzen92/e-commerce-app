import { TestBed } from '@angular/core/testing';
import { Product } from '../models';
import { CartService } from './cart.service';

/**
 * This test environment doesn't provide a working global `localStorage` (Node's own
 * experimental Web Storage implementation stays `undefined` without a CLI flag it doesn't set),
 * so persistence tests swap in this minimal in-memory stand-in to actually exercise the
 * read/write path instead of silently no-op'ing.
 */
class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
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

describe('CartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('starts empty', () => {
    const service = TestBed.inject(CartService);
    expect(service.items()).toEqual([]);
    expect(service.itemCount()).toBe(0);
  });

  it('adds a new product to the cart', () => {
    const service = TestBed.inject(CartService);
    service.addItem(buildProduct(), 2);

    expect(service.items()).toEqual([{ product: buildProduct(), quantity: 2 }]);
    expect(service.itemCount()).toBe(2);
  });

  it('increases the quantity when the same product is added again', () => {
    const service = TestBed.inject(CartService);
    service.addItem(buildProduct());
    service.addItem(buildProduct(), 3);

    expect(service.items()).toEqual([{ product: buildProduct(), quantity: 4 }]);
  });

  it('updates an item quantity directly', () => {
    const service = TestBed.inject(CartService);
    service.addItem(buildProduct());
    service.updateQuantity('prod-1', 5);

    expect(service.items()[0].quantity).toBe(5);
  });

  it('removes the item when the quantity is set to zero or below', () => {
    const service = TestBed.inject(CartService);
    service.addItem(buildProduct());
    service.updateQuantity('prod-1', 0);

    expect(service.items()).toEqual([]);
  });

  it('removes an item explicitly', () => {
    const service = TestBed.inject(CartService);
    service.addItem(buildProduct());
    service.removeItem('prod-1');

    expect(service.items()).toEqual([]);
  });

  it('clears the whole cart', () => {
    const service = TestBed.inject(CartService);
    service.addItem(buildProduct());
    service.addItem(buildProduct({ id: 'prod-2', slug: 'other' }));
    service.clear();

    expect(service.items()).toEqual([]);
  });

  it('computes the subtotal across quantities', () => {
    const service = TestBed.inject(CartService);
    service.addItem(buildProduct({ price: { amount: 100, currency: 'USD' } }), 2);
    service.addItem(buildProduct({ id: 'prod-2', slug: 'other', price: { amount: 50, currency: 'USD' } }), 1);

    expect(service.subtotal()).toEqual({ amount: 250, currency: 'USD' });
  });

  it('persists across service instances via localStorage', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: new MemoryStorage()
    });

    try {
      const service = TestBed.inject(CartService);
      service.addItem(buildProduct());

      TestBed.resetTestingModule();
      const freshService = TestBed.inject(CartService);

      expect(freshService.items()).toEqual([{ product: buildProduct(), quantity: 1 }]);
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(globalThis, 'localStorage', originalDescriptor);
      }
    }
  });

  it('never throws when localStorage is unavailable (private browsing, quota, etc.)', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get(): never {
        throw new Error('localStorage disabled');
      }
    });

    try {
      const service = TestBed.inject(CartService);
      expect(() => service.addItem(buildProduct())).not.toThrow();
      expect(service.items()).toEqual([{ product: buildProduct(), quantity: 1 }]);
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(globalThis, 'localStorage', originalDescriptor);
      }
    }
  });
});
