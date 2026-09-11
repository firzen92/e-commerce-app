import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResult } from '../../common/interfaces';
import { ProductQueryDto } from './dto';
import { PRODUCTS_REPOSITORY } from './interfaces';
import type { Product, ProductsRepository } from './interfaces';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  findAll(query: ProductQueryDto): Promise<PaginatedResult<Product>> {
    const { page, limit, categoryId, featuredOnly, searchTerm } = query;
    return this.productsRepository.findAll(
      { page, limit },
      { categoryId, featuredOnly, searchTerm },
    );
  }

  findBySlug(slug: string): Promise<Product | null> {
    return this.productsRepository.findBySlug(slug);
  }
}
