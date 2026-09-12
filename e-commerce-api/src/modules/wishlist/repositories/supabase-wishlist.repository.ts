import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database, SUPABASE_CLIENT } from '../../../supabase';
import type { WishlistEntry, WishlistRepository } from '../interfaces';

interface WishlistEntryRow {
  product_id: string;
  created_at: string;
}

const TABLE_NAME = 'wishlist_items';

@Injectable()
export class SupabaseWishlistRepository implements WishlistRepository {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async findAllForUser(userId: string): Promise<WishlistEntry[]> {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select('product_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .returns<WishlistEntryRow[]>();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data.map((row) => ({
      productId: row.product_id,
      createdAt: row.created_at,
    }));
  }

  async add(userId: string, productId: string): Promise<void> {
    const row: Database['public']['Tables']['wishlist_items']['Insert'] = {
      user_id: userId,
      product_id: productId,
    };

    // Upsert + ignoreDuplicates keeps "add to wishlist" idempotent: calling it twice for the
    // same product is a no-op rather than a unique-constraint error.
    //
    // The `as any` here works around a pre-existing @supabase/postgrest-js generic-inference
    // bug against this project's TypeScript version (5.9.x vs. the ~5.8.3 it's built against):
    // `.upsert()` fails to resolve its Row type for ANY table, not just this one — confirmed
    // against the existing `products` table too. Revisit once postgrest-js/typescript versions
    // are realigned; `row` above stays fully typed so this doesn't hide a real shape mismatch.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const { error } = await (this.supabase.from(TABLE_NAME) as any).upsert(
      row,
      {
        onConflict: 'user_id,product_id',
        ignoreDuplicates: true,
      },
    );

    if (error) {
      throw new InternalServerErrorException(
        (error as { message: string }).message,
      );
    }
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
