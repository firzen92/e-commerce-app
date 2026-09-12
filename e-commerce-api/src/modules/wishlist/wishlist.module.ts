import { Module } from '@nestjs/common';
import { ProductsModule } from '../products';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { WISHLIST_REPOSITORY } from './interfaces';
import { SupabaseWishlistRepository } from './repositories';

@Module({
  imports: [ProductsModule],
  controllers: [WishlistController],
  providers: [
    WishlistService,
    { provide: WISHLIST_REPOSITORY, useClass: SupabaseWishlistRepository },
  ],
})
export class WishlistModule {}
