import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../../models';
import { AUTH_SERVICE, WISHLIST_SERVICE } from '../../../core/services';
import { formatMoney } from '../../utils/currency.util';
import { Rating } from '../rating/rating';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatIconModule, RouterLink, Rating],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCard {
  private readonly authService = inject(AUTH_SERVICE);
  private readonly wishlistService = inject(WISHLIST_SERVICE);
  private readonly router = inject(Router);

  readonly product = input.required<Product>();

  protected readonly primaryImage = computed(() => this.product().images[0]);
  protected readonly formattedPrice = computed(() => formatMoney(this.product().price));
  protected readonly formattedCompareAtPrice = computed(() => {
    const compareAtPrice = this.product().compareAtPrice;
    return compareAtPrice ? formatMoney(compareAtPrice) : null;
  });
  protected readonly isOutOfStock = computed(() => !this.product().inventory.inStock);
  protected readonly isWishlisted = computed(() =>
    (this.wishlistService.items() ?? []).some((item) => item.product.id === this.product().id)
  );

  protected toggleWishlist(event: Event): void {
    // Stop the full-card link underneath from also navigating to the product page.
    event.preventDefault();
    event.stopPropagation();

    if (!this.authService.currentUser()) {
      void this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const action$ = this.isWishlisted()
      ? this.wishlistService.remove(this.product().id)
      : this.wishlistService.add(this.product().id);

    action$.subscribe({ error: () => undefined });
  }
}
