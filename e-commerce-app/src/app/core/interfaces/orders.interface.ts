import { Observable } from 'rxjs';
import { CreateOrderItem, Order } from '../../models';

export interface OrdersService {
  placeOrder(items: readonly CreateOrderItem[]): Observable<Order>;
}
