import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateOrderItem, Order } from '../../models';
import { OrderApiModel, mapOrderApiModelToOrder } from '../api';
import { OrdersService } from '../interfaces';

@Injectable()
export class HttpOrdersService implements OrdersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/orders`;

  placeOrder(items: readonly CreateOrderItem[]): Observable<Order> {
    return this.http.post<OrderApiModel>(this.baseUrl, { items }).pipe(map(mapOrderApiModelToOrder));
  }
}
