import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database, SUPABASE_CLIENT } from '../../../supabase';
import { PaginationQueryDto } from '../../../common/dto';
import { PaginatedResult } from '../../../common/interfaces';
import { CreateOrderInput, Order, OrdersRepository } from '../interfaces';

const TABLE_NAME = 'orders';

@Injectable()
export class SupabaseOrdersRepository implements OrdersRepository {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async findAllForUser(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<Order>> {
    const { page, limit } = pagination;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.supabase
      .from(TABLE_NAME)
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return { data, page, limit, total: count ?? 0 };
  }

  async findByIdForUser(id: string, userId: string): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async create(userId: string, input: CreateOrderInput): Promise<Order> {
    const row: Database['public']['Tables']['orders']['Insert'] = {
      user_id: userId,
      line_items: input.lineItems,
      total_amount: input.totalAmount,
      total_currency: input.totalCurrency,
    };

    // The `as any` here works around the same pre-existing @supabase/postgrest-js
    // generic-inference bug noted in supabase-wishlist.repository.ts: `.insert()` fails to
    // resolve its Row type against this project's TypeScript version for ANY table. `row`
    // above stays fully typed so this doesn't hide a real shape mismatch.
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    const { data, error } = await (this.supabase.from(TABLE_NAME) as any)
      .insert(row)
      .select('*')
      .single();
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

    if (error) {
      throw new InternalServerErrorException(
        (error as { message: string }).message,
      );
    }

    return data as Order;
  }
}
