import { Review } from './review.interface';

export const REVIEWS_REPOSITORY = Symbol('REVIEWS_REPOSITORY');

export interface ReviewsRepository {
  findAllForProduct(productId: string): Promise<Review[]>;
  upsert(
    userId: string,
    productId: string,
    rating: number,
    comment: string | null,
  ): Promise<Review>;
  remove(userId: string, productId: string): Promise<void>;
}
