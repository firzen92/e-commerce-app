import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';
import { AUTH_SERVICE, REVIEWS_CATALOG } from '../../../../core/services';
import { Review } from '../../../../models';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReviews {
  private readonly reviewsCatalog = inject(REVIEWS_CATALOG);
  private readonly authService = inject(AUTH_SERVICE);
  private readonly router = inject(Router);

  readonly productId = input.required<string>();

  /** Emitted after a review is saved or deleted, so the host page can refresh the product's aggregate rating. */
  readonly reviewsChanged = output<void>();

  protected readonly stars = [1, 2, 3, 4, 5];

  private readonly refreshTrigger = signal(0);

  private readonly reviews$ = combineLatest([
    toObservable(this.productId),
    toObservable(this.refreshTrigger)
  ]).pipe(switchMap(([productId]) => this.reviewsCatalog.getReviews(productId)));

  /** `null` while the initial fetch for the current product is in flight. */
  protected readonly reviews = toSignal(this.reviews$, { initialValue: null });

  protected readonly currentUser = this.authService.currentUser;

  protected readonly myReview = computed<Review | null>(() => {
    const user = this.currentUser();
    const reviews = this.reviews();
    return user && reviews ? reviews.find((review) => review.userId === user.id) ?? null : null;
  });

  protected readonly otherReviews = computed(() => {
    const myUserId = this.currentUser()?.id;
    return (this.reviews() ?? []).filter((review) => review.userId !== myUserId);
  });

  protected readonly isEditing = signal(false);
  protected readonly draftRating = signal(0);
  protected readonly draftComment = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected startReview(): void {
    if (!this.currentUser()) {
      void this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const existing = this.myReview();
    this.draftRating.set(existing?.rating ?? 0);
    this.draftComment.set(existing?.comment ?? '');
    this.errorMessage.set(null);
    this.isEditing.set(true);
  }

  protected cancelEditing(): void {
    this.isEditing.set(false);
    this.errorMessage.set(null);
  }

  protected setDraftRating(rating: number): void {
    this.draftRating.set(rating);
  }

  protected onCommentInput(event: Event): void {
    this.draftComment.set((event.target as HTMLTextAreaElement).value);
  }

  protected submitReview(): void {
    if (this.draftRating() < 1) {
      this.errorMessage.set('Choose a star rating.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.reviewsCatalog
      .submitReview(this.productId(), {
        rating: this.draftRating(),
        comment: this.draftComment().trim() || undefined
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.isEditing.set(false);
          this.refreshTrigger.update((value) => value + 1);
          this.reviewsChanged.emit();
        },
        error: () => {
          this.isSubmitting.set(false);
          this.errorMessage.set('Something went wrong. Please try again.');
        }
      });
  }

  protected deleteReview(): void {
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.reviewsCatalog.deleteReview(this.productId()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isEditing.set(false);
        this.refreshTrigger.update((value) => value + 1);
        this.reviewsChanged.emit();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Something went wrong. Please try again.');
      }
    });
  }

  protected formatDate(dateIso: string): string {
    return new Date(dateIso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
