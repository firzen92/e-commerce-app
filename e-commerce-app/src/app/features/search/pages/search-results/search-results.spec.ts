import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../../../app.routes';
import {
  AUTH_SERVICE,
  MockAuthService,
  MockProductCatalogService,
  MockWishlistService,
  PRODUCT_CATALOG,
  WISHLIST_SERVICE
} from '../../../../core/services';
import { SearchResults } from './search-results';

describe('SearchResults', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResults],
      providers: [
        provideRouter(routes),
        { provide: PRODUCT_CATALOG, useClass: MockProductCatalogService },
        { provide: AUTH_SERVICE, useClass: MockAuthService },
        { provide: WISHLIST_SERVICE, useClass: MockWishlistService }
      ]
    }).compileComponents();
  });

  it('prompts for a search term when none is provided', async () => {
    const fixture = TestBed.createComponent(SearchResults);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.search-page__empty')?.textContent).toContain(
      'Type a search term'
    );
  });

  it('lists matching products for the bound query', async () => {
    const fixture = TestBed.createComponent(SearchResults);
    fixture.componentRef.setInput('q', 'lamp');
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-product-card').length).toBeGreaterThan(0);
  });

  it('shows an empty state when nothing matches', async () => {
    const fixture = TestBed.createComponent(SearchResults);
    fixture.componentRef.setInput('q', 'no-such-product-xyz');
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.search-page__empty')?.textContent).toContain(
      'No products match'
    );
  });

  it('navigates to the search route with the submitted term', async () => {
    const fixture = TestBed.createComponent(SearchResults);
    await fixture.whenStable();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input[aria-label="Search products"]') as HTMLInputElement;
    input.value = 'lamp';
    (compiled.querySelector('.search-page__form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { cancelable: true })
    );

    expect(navigateSpy).toHaveBeenCalledWith(['/search'], { queryParams: { q: 'lamp' } });
  });
});
