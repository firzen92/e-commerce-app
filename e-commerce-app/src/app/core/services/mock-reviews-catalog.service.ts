import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Review, SubmitReviewInput } from '../../models';
import { ReviewsCatalog } from '../interfaces';
import { AUTH_SERVICE } from './tokens';

/** In-memory `ReviewsCatalog` for tests and local development without a backend. */
@Injectable()
export class MockReviewsCatalogService implements ReviewsCatalog {
  private readonly authService = inject(AUTH_SERVICE);
  private readonly reviewsSignal = signal<readonly Review[]>([]);

  getReviews(productId: string): Observable<Review[]> {
    return of(this.reviewsSignal().filter((review) => review.productId === productId));
  }

  submitReview(productId: string, input: SubmitReviewInput): Observable<Review> {
    const user = this.authService.currentUser();
    if (!user) {
      return throwError(() => new Error('You must be signed in to leave a review.'));
    }

    const now = new Date().toISOString();
    const existing = this.reviewsSignal().find(
      (review) => review.productId === productId && review.userId === user.id
    );
    const review: Review = {
      id: existing?.id ?? `${productId}:${user.id}`,
      productId,
      userId: user.id,
      rating: input.rating,
      comment: input.comment ?? null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    };

    this.reviewsSignal.update((reviews) => [
      review,
      ...reviews.filter((candidate) => candidate.id !== review.id)
    ]);

    return of(review);
  }

  deleteReview(productId: string): Observable<void> {
    const user = this.authService.currentUser();
    if (user) {
      this.reviewsSignal.update((reviews) =>
        reviews.filter((review) => !(review.productId === productId && review.userId === user.id))
      );
    }

    return of(undefined);
  }
}
