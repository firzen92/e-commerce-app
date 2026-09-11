import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PRODUCTS_REPOSITORY } from './interfaces';
import { SupabaseProductsRepository } from './repositories';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    { provide: PRODUCTS_REPOSITORY, useClass: SupabaseProductsRepository },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
