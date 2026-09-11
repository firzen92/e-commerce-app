import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { PRODUCT_CATALOG } from '../../../../core/services';
import { Rating } from '../../../../shared/components';
import { formatMoney } from '../../../../shared/utils/currency.util';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, Rating],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetail {
  private readonly productCatalog = inject(PRODUCT_CATALOG);

  /** Bound from the `:slug` route param via withComponentInputBinding(). */
  readonly slug = input.required<string>();

  private readonly product$ = toObservable(this.slug).pipe(
    switchMap((slug) => this.productCatalog.getProductBySlug(slug))
  );

  /** `null` while the lookup for the current slug is in flight, `undefined` once it resolves with no match. */
  protected readonly product = toSignal(this.product$, { initialValue: null });

  protected readonly selectedImageIndex = signal(0);
  protected readonly cartNoticeVisible = signal(false);

  protected readonly formattedPrice = computed(() => {
    const product = this.product();
    return product ? formatMoney(product.price) : null;
  });

  protected readonly formattedCompareAtPrice = computed(() => {
    const compareAtPrice = this.product()?.compareAtPrice;
    return compareAtPrice ? formatMoney(compareAtPrice) : null;
  });

  protected readonly selectedImage = computed(() => this.product()?.images[this.selectedImageIndex()]);

  constructor() {
    // Reset gallery selection and the cart notice whenever the viewed product changes.
    effect(() => {
      this.slug();
      this.selectedImageIndex.set(0);
      this.cartNoticeVisible.set(false);
    });
  }

  protected selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  protected onAddToCart(): void {
    this.cartNoticeVisible.set(true);
  }
}
