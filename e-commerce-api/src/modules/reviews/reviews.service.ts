import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../products';
import { REVIEWS_REPOSITORY } from './interfaces';
import type { Review, ReviewsRepository } from './interfaces';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(REVIEWS_REPOSITORY)
    private readonly reviewsRepository: ReviewsRepository,
    private readonly productsService: ProductsService,
  ) {}

  findAllForProduct(productId: string): Promise<Review[]> {
    return this.reviewsRepository.findAllForProduct(productId);
  }

  async upsert(
    userId: string,
    productId: string,
    rating: number,
    comment: string | null,
  ): Promise<Review> {
    const products = await this.productsService.findByIds([productId]);
    if (products.length === 0) {
      throw new NotFoundException('Product not found.');
    }

    return this.reviewsRepository.upsert(userId, productId, rating, comment);
  }

  remove(userId: string, productId: string): Promise<void> {
    return this.reviewsRepository.remove(userId, productId);
  }
}
