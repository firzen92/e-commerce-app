import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateOrderItem, Order } from '../../models';
import { OrderApiModel, PaginatedApiResult, mapOrderApiModelToOrder } from '../api';
import { OrdersService } from '../interfaces';

/** Largest page the paginated `GET /orders` endpoint allows in one request (see `PaginationQueryDto` on the API). */
const MAX_PAGE_SIZE = 100;

@Injectable()
export class HttpOrdersService implements OrdersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/orders`;

  placeOrder(items: readonly CreateOrderItem[]): Observable<Order> {
    return this.http.post<OrderApiModel>(this.baseUrl, { items }).pipe(map(mapOrderApiModelToOrder));
  }

  listOrders(): Observable<Order[]> {
    const params = new HttpParams().set('limit', String(MAX_PAGE_SIZE));

    return this.http
      .get<PaginatedApiResult<OrderApiModel>>(this.baseUrl, { params })
      .pipe(map((result) => result.data.map(mapOrderApiModelToOrder)));
  }
}
