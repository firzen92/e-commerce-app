import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';
import { Product } from '../../../../models';
import { PRODUCT_CATALOG } from '../../../../core/services';
import { CartService } from '../../../../state/cart.service';
import { Rating } from '../../../../shared/components';
import { formatMoney } from '../../../../shared/utils/currency.util';
import { ProductReviews } from '../../components/product-reviews/product-reviews';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, Rating, ProductReviews],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetail {
  private readonly productCatalog = inject(PRODUCT_CATALOG);
  private readonly cartService = inject(CartService);

  /** Bound from the `:slug` route param via withComponentInputBinding(). */
  readonly slug = input.required<string>();

  /** Bumped when reviews change so the product (and its aggregate rating) is refetched without resetting the page. */
  private readonly productRefresh = signal(0);

  private readonly product$ = combineLatest([toObservable(this.slug), toObservable(this.productRefresh)]).pipe(
    switchMap(([slug]) => this.productCatalog.getProductBySlug(slug))
  );

  /** `null` while the lookup for the current slug is in flight, `undefined` once it resolves with no match. */
  protected readonly product = toSignal(this.product$, { initialValue: null });

  protected readonly selectedImageIndex = signal(0);
  protected readonly cartNoticeVisible = signal(false);
  protected readonly quantity = signal(1);

  protected readonly formattedPrice = computed(() => {
    const product = this.product();
    return product ? formatMoney(product.price) : null;
  });

  protected readonly formattedCompareAtPrice = computed(() => {
    const compareAtPrice = this.product()?.compareAtPrice;
    return compareAtPrice ? formatMoney(compareAtPrice) : null;
  });

  protected readonly selectedImage = computed(() => this.product()?.images[this.selectedImageIndex()]);

  protected readonly atMaxQuantity = computed(() => {
    const max = this.product()?.inventory.quantity;
    return max != null && this.quantity() >= max;
  });

  constructor() {
    // Reset gallery selection, quantity, and the cart notice whenever the viewed product changes.
    effect(() => {
      this.slug();
      this.selectedImageIndex.set(0);
      this.cartNoticeVisible.set(false);
      this.quantity.set(1);
    });
  }

  protected onReviewsChanged(): void {
    this.productRefresh.update((value) => value + 1);
  }

  protected selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  protected incrementQuantity(): void {
    if (!this.atMaxQuantity()) {
      this.quantity.update((quantity) => quantity + 1);
    }
  }

  protected decrementQuantity(): void {
    this.quantity.update((quantity) => Math.max(1, quantity - 1));
  }

  protected onAddToCart(product: Product): void {
    this.cartService.addItem(product, this.quantity());
    this.cartNoticeVisible.set(true);
  }
}
