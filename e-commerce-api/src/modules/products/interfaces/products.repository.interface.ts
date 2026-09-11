import { PaginatedResult } from '../../../common/interfaces';
import { PaginationQueryDto } from '../../../common/dto';
import { Product } from './product.interface';

export interface ProductFilters {
  categoryId?: string;
  featuredOnly?: boolean;
  searchTerm?: string;
}

export const PRODUCTS_REPOSITORY = Symbol('PRODUCTS_REPOSITORY');

export interface ProductsRepository {
  findAll(
    pagination: PaginationQueryDto,
    filters?: ProductFilters,
  ): Promise<PaginatedResult<Product>>;
  findBySlug(slug: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
}
