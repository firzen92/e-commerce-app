import { Module } from '@nestjs/common';
import { ProductsModule } from '../products';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { REVIEWS_REPOSITORY } from './interfaces';
import { SupabaseReviewsRepository } from './repositories';

@Module({
  imports: [ProductsModule],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    { provide: REVIEWS_REPOSITORY, useClass: SupabaseReviewsRepository },
  ],
})
export class ReviewsModule {}
