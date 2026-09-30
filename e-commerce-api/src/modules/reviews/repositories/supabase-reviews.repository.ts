import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database, SUPABASE_CLIENT } from '../../../supabase';
import type { Review, ReviewsRepository } from '../interfaces';

interface ReviewRow {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

const TABLE_NAME = 'reviews';

function mapRow(row: ReviewRow): Review {
  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

@Injectable()
export class SupabaseReviewsRepository implements ReviewsRepository {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async findAllForProduct(productId: string): Promise<Review[]> {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .returns<ReviewRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data.map(mapRow);
  }

  async upsert(
    userId: string,
    productId: string,
    rating: number,
    comment: string | null,
  ): Promise<Review> {
    const row: Database['public']['Tables']['reviews']['Insert'] = {
      user_id: userId,
      product_id: productId,
      rating,
      comment,
    };

    // Same @supabase/postgrest-js generic-inference bug as wishlist's `.upsert()`/orders'
    // `.insert()` (fails to resolve the Row type for ANY table against this project's
    // TypeScript version) — same `as any` workaround; `row` above stays fully typed so this
    // doesn't hide a real shape mismatch.
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    const { data, error } = await (this.supabase.from(TABLE_NAME) as any)
      .upsert(row, { onConflict: 'product_id,user_id' })
      .select('*')
      .single();
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

    if (error) {
      throw new InternalServerErrorException(
        (error as { message: string }).message,
      );
    }

    return mapRow(data as ReviewRow);
  }

  async remove(userId: string, productId: string): Promise<void> {
    const { error } = await this.supabase
      .from(TABLE_NAME)
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
