import { CurrencyCode } from '../../models/money.model';
import { Order, OrderLineItem } from '../../models';
import { mapProductApiModelToProduct } from './product-api.mapper';
import { OrderApiModel, OrderLineItemApiModel } from './order-api.model';

function mapOrderLineItemApiModelToOrderLineItem(apiModel: OrderLineItemApiModel): OrderLineItem {
  return {
    productId: apiModel.product_id,
    quantity: apiModel.quantity,
    unitPrice: {
      amount: apiModel.unit_price_amount,
      currency: apiModel.unit_price_currency as CurrencyCode
    },
    product: apiModel.product ? mapProductApiModelToProduct(apiModel.product) : null
  };
}

export function mapOrderApiModelToOrder(apiModel: OrderApiModel): Order {
  return {
    id: apiModel.id,
    status: apiModel.status,
    lineItems: apiModel.line_items.map(mapOrderLineItemApiModelToOrderLineItem),
    total: {
      amount: apiModel.total_amount,
      currency: apiModel.total_currency as CurrencyCode
    },
    createdAt: apiModel.created_at
  };
}
