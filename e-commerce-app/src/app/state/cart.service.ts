import { Injectable, computed, signal } from '@angular/core';
import { CartItem, CurrencyCode, Money, Product } from '../models';

const STORAGE_KEY = 'aurelia:cart';

function readStoredItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    // Corrupt JSON, storage disabled, or a private-browsing quota error — just start empty.
    return [];
  }
}

function writeStoredItems(items: readonly CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore write failures (private browsing, quota, etc.) — the cart just won't persist.
  }
}

/**
 * Client-only shopping cart: signals + localStorage, no backend involved. Deliberately a plain
 * `providedIn: 'root'` service rather than an interface+token pair like the other `core/services`
 * — there's no server-backed variant to swap in, so that indirection would be pure ceremony.
 * Lives in `state/` (not `core/services/`) for exactly that reason.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSignal = signal<readonly CartItem[]>(readStoredItems());
  readonly items = this.itemsSignal.asReadonly();

  readonly itemCount = computed(() => this.items().reduce((total, item) => total + item.quantity, 0));

  readonly subtotal = computed<Money>(() => {
    const items = this.items();
    const currency: CurrencyCode = items[0]?.product.price.currency ?? 'USD';
    const amount = items.reduce((total, item) => total + item.product.price.amount * item.quantity, 0);
    return { amount, currency };
  });

  addItem(product: Product, quantity = 1): void {
    this.update((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...items, { product, quantity }];
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.update((items) =>
      items.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  }

  removeItem(productId: string): void {
    this.update((items) => items.filter((item) => item.product.id !== productId));
  }

  clear(): void {
    this.update(() => []);
  }

  /** Applies an update and persists synchronously, so callers never race the write. */
  private update(updateFn: (items: readonly CartItem[]) => readonly CartItem[]): void {
    const items = updateFn(this.itemsSignal());
    this.itemsSignal.set(items);
    writeStoredItems(items);
  }
}
