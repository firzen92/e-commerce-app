import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database, SUPABASE_CLIENT } from '../../../supabase';
import { PaginationQueryDto } from '../../../common/dto';
import { PaginatedResult } from '../../../common/interfaces';
import { Order, OrdersRepository } from '../interfaces';

@Injectable()
export class SupabaseOrdersRepository implements OrdersRepository {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  findAllForUser(
    _userId: string,
    _pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<Order>> {
    return Promise.reject(new Error('Not implemented'));
  }

  findByIdForUser(_id: string, _userId: string): Promise<Order | null> {
    return Promise.reject(new Error('Not implemented'));
  }
}
