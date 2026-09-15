import { Money } from './money.model';
import { Product } from './product.model';

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded';

export interface OrderLineItem {
  readonly productId: string;
  readonly quantity: number;
  readonly unitPrice: Money;
  /** The current product record, for display — `null` when the product has since been deleted. */
  readonly product: Product | null;
}

export interface Order {
  readonly id: string;
  readonly status: OrderStatus;
  readonly lineItems: readonly OrderLineItem[];
  readonly total: Money;
  readonly createdAt: string;
}

export interface CreateOrderItem {
  readonly productId: string;
  readonly quantity: number;
}
