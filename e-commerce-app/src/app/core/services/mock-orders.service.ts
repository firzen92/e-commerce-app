import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CreateOrderItem, CurrencyCode, Order, OrderLineItem, Product } from '../../models';
import { OrdersService } from '../interfaces';
import productsMock from '../../data/mock/products.mock.json';

/** In-memory `OrdersService` for tests and local development without a backend. */
@Injectable()
export class MockOrdersService implements OrdersService {
  private readonly products: Product[] = productsMock as Product[];

  placeOrder(items: readonly CreateOrderItem[]): Observable<Order> {
    const now = new Date().toISOString();

    const lineItems: OrderLineItem[] = items.map((item) => {
      const product = this.products.find((candidate) => candidate.id === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product?.price ?? { amount: 0, currency: 'USD' as CurrencyCode }
      };
    });

    const currency = lineItems[0]?.unitPrice.currency ?? 'USD';
    const totalAmount = lineItems.reduce((sum, item) => sum + item.unitPrice.amount * item.quantity, 0);

    return of({
      id: `order-${now}`,
      status: 'pending',
      lineItems,
      total: { amount: totalAmount, currency },
      createdAt: now
    });
  }
}
