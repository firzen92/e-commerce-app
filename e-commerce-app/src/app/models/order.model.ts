import { Money } from './money.model';

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded';

export interface OrderLineItem {
  readonly productId: string;
  readonly quantity: number;
  readonly unitPrice: Money;
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
