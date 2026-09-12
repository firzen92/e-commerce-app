import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WishlistItem } from '../../models';
import { WishlistItemApiModel, mapWishlistItemApiModelToWishlistItem } from '../api';
import { WishlistService } from '../interfaces';
import { AUTH_SERVICE } from './tokens';

@Injectable()
export class HttpWishlistService implements WishlistService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AUTH_SERVICE);
  private readonly baseUrl = `${environment.apiBaseUrl}/wishlist`;

  private readonly itemsSignal = signal<readonly WishlistItem[] | undefined>(undefined);
  readonly items = this.itemsSignal.asReadonly();

  constructor() {
    // Reload whenever sign-in state changes; clear immediately on sign-out so a previous
    // user's wishlist never flashes for the next one on a shared device.
    effect(() => {
      const user = this.authService.currentUser();
      if (user === undefined) {
        return; // session still restoring
      }

      if (user === null) {
        this.itemsSignal.set([]);
        return;
      }

      this.fetchItems();
    });
  }

  add(productId: string): Observable<void> {
    return this.http.post<void>(this.baseUrl, { productId }).pipe(tap(() => this.fetchItems()));
  }

  remove(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`).pipe(tap(() => this.fetchItems()));
  }

  private fetchItems(): void {
    this.http
      .get<WishlistItemApiModel[]>(this.baseUrl)
      .pipe(
        catchError(() => of<WishlistItemApiModel[]>([]))
      )
      .subscribe((apiModels) => this.itemsSignal.set(apiModels.map(mapWishlistItemApiModelToWishlistItem)));
  }
}
