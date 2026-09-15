import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ORDERS_SERVICE } from '../../../../core/services';
import { formatMoney } from '../../../../shared/utils/currency.util';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistory {
  private readonly ordersService = inject(ORDERS_SERVICE);

  /** `null` while the initial fetch is in flight, `undefined` if it failed. */
  protected readonly orders = toSignal(this.ordersService.listOrders().pipe(catchError(() => of(undefined))), {
    initialValue: null
  });

  protected readonly formatMoney = formatMoney;

  protected formatDate(dateIso: string): string {
    return new Date(dateIso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
