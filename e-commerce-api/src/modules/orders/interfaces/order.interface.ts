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
