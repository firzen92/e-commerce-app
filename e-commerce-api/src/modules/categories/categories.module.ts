import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CATEGORIES_REPOSITORY } from './interfaces';
import { SupabaseCategoriesRepository } from './repositories';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    { provide: CATEGORIES_REPOSITORY, useClass: SupabaseCategoriesRepository },
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
