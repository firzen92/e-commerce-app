import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PRODUCT_CATALOG } from '../../../../core/services';
import { ProductCard } from '../../../../shared/components';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [RouterLink, ProductCard],
  templateUrl: './featured-products.html',
  styleUrl: './featured-products.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedProducts {
  private readonly productCatalog = inject(PRODUCT_CATALOG);

  protected readonly featuredProducts = toSignal(this.productCatalog.getFeaturedProducts(4), {
    initialValue: []
  });
}
