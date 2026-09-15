import { PaginatedResult } from '../../../common/interfaces';
import { PaginationQueryDto } from '../../../common/dto';
import { CreateOrderInput, Order } from './order.interface';

export const ORDERS_REPOSITORY = Symbol('ORDERS_REPOSITORY');

export interface OrdersRepository {
  findAllForUser(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<Order>>;
  findByIdForUser(id: string, userId: string): Promise<Order | null>;
  create(userId: string, input: CreateOrderInput): Promise<Order>;
}
