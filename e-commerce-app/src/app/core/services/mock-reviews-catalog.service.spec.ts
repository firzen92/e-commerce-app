import { TestBed } from '@angular/core/testing';
import { Review } from '../../models';
import { AUTH_SERVICE } from './tokens';
import { MockAuthService } from './mock-auth.service';
import { MockReviewsCatalogService } from './mock-reviews-catalog.service';

describe('MockReviewsCatalogService', () => {
  let service: MockReviewsCatalogService;
  let authService: MockAuthService;

  beforeEach(() => {
    authService = new MockAuthService();

    TestBed.configureTestingModule({
      providers: [MockReviewsCatalogService, { provide: AUTH_SERVICE, useValue: authService }]
    });

    service = TestBed.inject(MockReviewsCatalogService);
  });

  it('starts with no reviews for a product', async () => {
    const reviews = await new Promise<Review[]>((resolve) =>
      service.getReviews('prod-1').subscribe(resolve)
    );

    expect(reviews).toEqual([]);
  });

  it('rejects submitting a review while signed out', async () => {
    await expect(
      new Promise((resolve, reject) =>
        service.submitReview('prod-1', { rating: 5 }).subscribe({ next: resolve, error: reject })
      )
    ).rejects.toThrow();
  });

  it('creates a review for the signed-in user', async () => {
    authService.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe();

    const review = await new Promise<Review>((resolve) =>
      service.submitReview('prod-1', { rating: 4, comment: 'Nice.' }).subscribe(resolve)
    );

    expect(review.rating).toBe(4);
    expect(review.comment).toBe('Nice.');

    const reviews = await new Promise<Review[]>((resolve) =>
      service.getReviews('prod-1').subscribe(resolve)
    );
    expect(reviews).toHaveLength(1);
  });

  it('updates the existing review instead of creating a second one', async () => {
    authService.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe();
    await new Promise((resolve) => service.submitReview('prod-1', { rating: 3 }).subscribe(resolve));
    await new Promise((resolve) =>
      service.submitReview('prod-1', { rating: 5, comment: 'Actually great.' }).subscribe(resolve)
    );

    const reviews = await new Promise<Review[]>((resolve) =>
      service.getReviews('prod-1').subscribe(resolve)
    );
    expect(reviews).toHaveLength(1);
    expect(reviews[0].rating).toBe(5);
  });

  it('deletes the signed-in user review', async () => {
    authService.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe();
    await new Promise((resolve) => service.submitReview('prod-1', { rating: 3 }).subscribe(resolve));
    await new Promise((resolve) => service.deleteReview('prod-1').subscribe(resolve));

    const reviews = await new Promise<Review[]>((resolve) =>
      service.getReviews('prod-1').subscribe(resolve)
    );
    expect(reviews).toEqual([]);
  });
});
