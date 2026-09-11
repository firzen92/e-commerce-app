import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto';
import { PaginatedResult } from '../../common/interfaces';
import { ORDERS_REPOSITORY } from './interfaces';
import type { Order, OrdersRepository } from './interfaces';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepository,
  ) {}

  findAllForUser(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<Order>> {
    return this.ordersRepository.findAllForUser(userId, pagination);
  }

  findByIdForUser(id: string, userId: string): Promise<Order | null> {
    return this.ordersRepository.findByIdForUser(id, userId);
  }
}
