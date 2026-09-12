import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, WishlistItem } from '../../models';
import { WishlistService } from '../interfaces';
import productsMock from '../../data/mock/products.mock.json';

/** In-memory `WishlistService` for tests and local development without a backend. */
@Injectable()
export class MockWishlistService implements WishlistService {
  private readonly products: Product[] = productsMock as Product[];
  private readonly itemsSignal = signal<readonly WishlistItem[] | undefined>([]);
  readonly items = this.itemsSignal.asReadonly();

  add(productId: string): Observable<void> {
    const product = this.products.find((candidate) => candidate.id === productId);
    if (product && !this.itemsSignal()?.some((item) => item.product.id === productId)) {
      this.itemsSignal.update((items) => [...(items ?? []), { product, addedAt: new Date().toISOString() }]);
    }

    return of(undefined);
  }

  remove(productId: string): Observable<void> {
    this.itemsSignal.update((items) => items?.filter((item) => item.product.id !== productId));
    return of(undefined);
  }
}
