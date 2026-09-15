import { Product } from '../../products/interfaces';

export type OrderStatus =
  'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded';

export interface OrderLineItem {
  product_id: string;
  quantity: number;
  unit_price_amount: number;
  unit_price_currency: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  line_items: OrderLineItem[];
  total_amount: number;
  total_currency: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderInput {
  lineItems: OrderLineItem[];
  totalAmount: number;
  totalCurrency: string;
}

/** An order line item enriched with the *current* product record, for display purposes only
 *  — `unit_price_*` above remains the authoritative price actually paid at the time of purchase.
 *  `null` when the product has since been deleted. */
export interface OrderLineItemWithProduct extends OrderLineItem {
  product: Product | null;
}

export interface OrderWithProducts extends Omit<Order, 'line_items'> {
  line_items: OrderLineItemWithProduct[];
}
