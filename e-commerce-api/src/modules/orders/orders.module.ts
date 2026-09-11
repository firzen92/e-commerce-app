import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ORDERS_REPOSITORY } from './interfaces';
import { SupabaseOrdersRepository } from './repositories';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    { provide: ORDERS_REPOSITORY, useClass: SupabaseOrdersRepository },
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
