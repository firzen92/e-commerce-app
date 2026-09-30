import { Observable } from 'rxjs';
import { Review, SubmitReviewInput } from '../../models';

export interface ReviewsCatalog {
  getReviews(productId: string): Observable<Review[]>;
  submitReview(productId: string, input: SubmitReviewInput): Observable<Review>;
  deleteReview(productId: string): Observable<void>;
}
