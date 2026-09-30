import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../../../app.routes';
import {
  AUTH_SERVICE,
  MockAuthService,
  MockReviewsCatalogService,
  REVIEWS_CATALOG
} from '../../../../core/services';
import { ProductReviews } from './product-reviews';

describe('ProductReviews', () => {
  let authService: MockAuthService;
  let reviewsCatalog: MockReviewsCatalogService;

  beforeEach(async () => {
    authService = new MockAuthService();

    await TestBed.configureTestingModule({
      imports: [ProductReviews],
      providers: [
        provideRouter(routes),
        { provide: AUTH_SERVICE, useValue: authService },
        MockReviewsCatalogService,
        { provide: REVIEWS_CATALOG, useExisting: MockReviewsCatalogService }
      ]
    }).compileComponents();

    reviewsCatalog = TestBed.inject(MockReviewsCatalogService);
  });

  it('shows an empty state with no reviews', async () => {
    const fixture = TestBed.createComponent(ProductReviews);
    fixture.componentRef.setInput('productId', 'prod-1');
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.product-reviews__empty')?.textContent).toContain('No reviews yet');
  });

  it('lists an existing review from another shopper', async () => {
    authService.signIn({ email: 'other-shopper@example.com', password: 'password123' }).subscribe();
    await new Promise((resolve) =>
      reviewsCatalog.submitReview('prod-1', { rating: 4, comment: 'Solid build.' }).subscribe(resolve)
    );
    authService.signOut().subscribe();

    const fixture = TestBed.createComponent(ProductReviews);
    fixture.componentRef.setInput('productId', 'prod-1');
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.product-reviews__item-comment')?.textContent).toContain('Solid build.');
  });

  it('redirects a signed-out shopper to login when writing a review', async () => {
    authService.signOut().subscribe();

    const fixture = TestBed.createComponent(ProductReviews);
    fixture.componentRef.setInput('productId', 'prod-1');
    await fixture.whenStable();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.product-reviews__write-button') as HTMLButtonElement).click();

    expect(navigateSpy).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: router.url } });
    expect(compiled.querySelector('.product-reviews__form')).toBeNull();
  });

  it('submits a review and shows it as "Your review"', async () => {
    authService.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe();

    const fixture = TestBed.createComponent(ProductReviews);
    fixture.componentRef.setInput('productId', 'prod-1');
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.product-reviews__write-button') as HTMLButtonElement).click();
    fixture.detectChanges();

    const stars = compiled.querySelectorAll<HTMLButtonElement>('.product-reviews__star');
    stars[3].click();
    fixture.detectChanges();

    const textarea = compiled.querySelector('.product-reviews__comment-input') as HTMLTextAreaElement;
    textarea.value = 'Would buy again.';
    textarea.dispatchEvent(new Event('input'));

    (compiled.querySelector('.product-reviews__submit') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(compiled.querySelector('.product-reviews__item--mine .product-reviews__item-comment')?.textContent).toContain(
      'Would buy again.'
    );
  });

  it('emits reviewsChanged after a review is saved', async () => {
    authService.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe();

    const fixture = TestBed.createComponent(ProductReviews);
    fixture.componentRef.setInput('productId', 'prod-1');
    const changed = vi.fn();
    fixture.componentInstance.reviewsChanged.subscribe(changed);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.product-reviews__write-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    compiled.querySelectorAll<HTMLButtonElement>('.product-reviews__star')[4].click();
    fixture.detectChanges();
    (compiled.querySelector('.product-reviews__submit') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(changed).toHaveBeenCalledTimes(1);
  });
});
