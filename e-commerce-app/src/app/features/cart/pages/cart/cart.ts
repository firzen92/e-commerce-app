import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../state/cart.service';
import { formatMoney } from '../../../../shared/utils/currency.util';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cart {
  private readonly cartService = inject(CartService);

  protected readonly items = this.cartService.items;
  protected readonly subtotal = this.cartService.subtotal;
  protected readonly checkoutNoticeVisible = signal(false);
  protected readonly formatMoney = formatMoney;

  protected decrement(productId: string, currentQuantity: number): void {
    this.cartService.updateQuantity(productId, currentQuantity - 1);
  }

  protected increment(productId: string, currentQuantity: number, maxQuantity: number | undefined): void {
    if (maxQuantity != null && currentQuantity >= maxQuantity) {
      return;
    }

    this.cartService.updateQuantity(productId, currentQuantity + 1);
  }

  protected remove(productId: string): void {
    this.cartService.removeItem(productId);
  }

  protected onCheckout(): void {
    this.checkoutNoticeVisible.set(true);
  }
}
