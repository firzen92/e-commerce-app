import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  untracked
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, Subscription, map, of, startWith, switchMap } from 'rxjs';
import { CATEGORY_CATALOG, PRODUCT_CATALOG } from '../../../../core/services';
import { Category, Product } from '../../../../models';
import { ProductCard } from '../../../../shared/components';

const PAGE_SIZE = 12;

type CategoryState =
  | { readonly kind: 'loading' }
  | { readonly kind: 'all' }
  | { readonly kind: 'found'; readonly category: Category }
  | { readonly kind: 'missing' };

/** Serves both `/shop` (every product) and `/category/:slug` (one category). */
@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductCard, RouterLink, RouterLinkActive],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Shop {
  private readonly productCatalog = inject(PRODUCT_CATALOG);
  private readonly categoryCatalog = inject(CATEGORY_CATALOG);

  /** Bound from the `:slug` route param via withComponentInputBinding(); absent on `/shop`. */
  readonly slug = input<string | undefined>(undefined);

  protected readonly categories = toSignal(this.categoryCatalog.getCategories(), { initialValue: [] });

  protected readonly categoryState = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug): Observable<CategoryState> => {
        if (!slug) {
          return of({ kind: 'all' });
        }
        return this.categoryCatalog.getCategoryBySlug(slug).pipe(
          map((category): CategoryState => (category ? { kind: 'found', category } : { kind: 'missing' })),
          startWith<CategoryState>({ kind: 'loading' })
        );
      })
    ),
    { initialValue: { kind: 'loading' } as CategoryState }
  );

  protected readonly products = signal<readonly Product[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly hasMore = signal(false);
  protected readonly hasError = signal(false);

  private nextPage = 1;
  private categoryId: string | undefined;
  private request: Subscription | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.request?.unsubscribe());

    // Start over whenever the viewed category changes.
    effect(() => {
      const state = this.categoryState();

      untracked(() => {
        this.request?.unsubscribe();
        this.nextPage = 1;
        this.products.set([]);
        this.hasMore.set(false);
        this.hasError.set(false);

        if (state.kind === 'all' || state.kind === 'found') {
          this.categoryId = state.kind === 'found' ? state.category.id : undefined;
          this.fetchPage(1);
        } else {
          this.isLoading.set(state.kind === 'loading');
        }
      });
    });
  }

  /** Fetches the next page, or re-attempts the one that just failed. */
  protected loadMore(): void {
    this.fetchPage(this.nextPage);
  }

  private fetchPage(page: number): void {
    this.request?.unsubscribe();
    this.isLoading.set(true);
    this.hasError.set(false);

    this.request = this.productCatalog
      .getProducts({ categoryId: this.categoryId, page, limit: PAGE_SIZE })
      .subscribe({
        next: (batch) => {
          this.nextPage = page + 1;
          this.products.update((current) => [...current, ...batch]);
          this.hasMore.set(batch.length === PAGE_SIZE);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
        }
      });
  }
}
