import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Product } from '../../../models';
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
  readonly product = input.required<Product>();

  protected readonly primaryImage = computed(() => this.product().images[0]);
  protected readonly formattedPrice = computed(() => formatMoney(this.product().price));
  protected readonly formattedCompareAtPrice = computed(() => {
    const compareAtPrice = this.product().compareAtPrice;
    return compareAtPrice ? formatMoney(compareAtPrice) : null;
  });
  protected readonly isOutOfStock = computed(() => !this.product().inventory.inStock);
}
