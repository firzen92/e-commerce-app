import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AUTH_SERVICE, ORDERS_SERVICE } from '../../../../core/services';
import { Order } from '../../../../models';
import { CartService } from '../../../../state/cart.service';
import { formatMoney } from '../../../../shared/utils/currency.util';

type CheckoutState = 'idle' | 'processing' | 'error';

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
  private readonly authService = inject(AUTH_SERVICE);
  private readonly ordersService = inject(ORDERS_SERVICE);
  private readonly router = inject(Router);

  protected readonly items = this.cartService.items;
  protected readonly subtotal = this.cartService.subtotal;
  protected readonly formatMoney = formatMoney;

  protected readonly checkoutState = signal<CheckoutState>('idle');
  protected readonly placedOrder = signal<Order | null>(null);

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
    if (!this.authService.currentUser()) {
      void this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }

    this.checkoutState.set('processing');

    const orderItems = this.items().map((item) => ({ productId: item.product.id, quantity: item.quantity }));

    this.ordersService.placeOrder(orderItems).subscribe({
      next: (order) => {
        this.placedOrder.set(order);
        this.checkoutState.set('idle');
        this.cartService.clear();
      },
      error: () => this.checkoutState.set('error')
    });
  }
}
