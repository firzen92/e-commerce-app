import { OrderStatus } from '../../models';

export interface OrderLineItemApiModel {
  product_id: string;
  quantity: number;
  unit_price_amount: number;
  unit_price_currency: string;
}

export interface OrderApiModel {
  id: string;
  user_id: string;
  status: OrderStatus;
  line_items: OrderLineItemApiModel[];
  total_amount: number;
  total_currency: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderItemApiModel {
  productId: string;
  quantity: number;
}

export interface CreateOrderApiModel {
  items: CreateOrderItemApiModel[];
}
