import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { PRODUCT_CATALOG } from '../../../../core/services';
import { Product } from '../../../../models';
import { ProductCard } from '../../../../shared/components';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResults {
  private readonly productCatalog = inject(PRODUCT_CATALOG);
  private readonly router = inject(Router);

  /** Bound from the `q` query param via withComponentInputBinding(). */
  readonly q = input<string>('');

  private readonly results$ = toObservable(this.q).pipe(
    switchMap((term) => {
      const trimmed = term.trim();
      return trimmed ? this.productCatalog.getProducts({ searchTerm: trimmed }) : of(null);
    })
  );

  /** `null` while there's no search term entered; an array (possibly empty) once results resolve. */
  protected readonly results = toSignal<Product[] | null>(this.results$, { initialValue: null });

  protected onSubmit(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const term = input.value.trim();

    if (!term) {
      return;
    }

    void this.router.navigate(['/search'], { queryParams: { q: term } });
  }
}
