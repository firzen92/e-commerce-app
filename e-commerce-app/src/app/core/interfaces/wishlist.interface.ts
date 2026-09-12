import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { WishlistItem } from '../../models';

export interface WishlistService {
  /** `undefined` while the initial list is loading or the session is still restoring; `[]` for signed-out users. */
  readonly items: Signal<readonly WishlistItem[] | undefined>;
  add(productId: string): Observable<void>;
  remove(productId: string): Observable<void>;
}
