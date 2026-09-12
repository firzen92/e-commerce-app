import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WISHLIST_SERVICE } from '../../../../core/services';
import { ProductCard } from '../../../../shared/components';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, ProductCard],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Wishlist {
  private readonly wishlistService = inject(WISHLIST_SERVICE);

  protected readonly items = this.wishlistService.items;
}
