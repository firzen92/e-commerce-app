import { Inject, Injectable } from '@nestjs/common';
import { CATEGORIES_REPOSITORY } from './interfaces';
import type { Category, CategoriesRepository } from './interfaces';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.findAll();
  }

  findBySlug(slug: string): Promise<Category | null> {
    return this.categoriesRepository.findBySlug(slug);
  }
}
