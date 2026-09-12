import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../supabase';
import type { Database } from '../../../supabase';
import type { PaginationQueryDto } from '../../../common/dto';
import type { PaginatedResult } from '../../../common/interfaces';
import type {
  Product,
  ProductFilters,
  ProductsRepository,
} from '../interfaces';

const TABLE_NAME = 'products';

@Injectable()
export class SupabaseProductsRepository implements ProductsRepository {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async findAll(
    pagination: PaginationQueryDto,
    filters?: ProductFilters,
  ): Promise<PaginatedResult<Product>> {
    const { page, limit } = pagination;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase.from(TABLE_NAME).select('*', { count: 'exact' });

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    if (filters?.featuredOnly) {
      query = query.eq('is_featured', true);
    }

    if (filters?.searchTerm) {
      query = query.ilike('name', `%${filters.searchTerm}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return { data, page, limit, total: count ?? 0 };
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase
      .from(TABLE_NAME)
      .select('*')
      .in('id', ids);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }
}
