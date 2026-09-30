import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../../../app.routes';
import {
  AUTH_SERVICE,
  CATEGORY_CATALOG,
  MockAuthService,
  MockCategoryCatalogService,
  MockProductCatalogService,
  MockWishlistService,
  PRODUCT_CATALOG,
  WISHLIST_SERVICE
} from '../../../../core/services';
import { Shop } from './shop';

describe('Shop', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shop],
      providers: [
        provideRouter(routes),
        { provide: PRODUCT_CATALOG, useClass: MockProductCatalogService },
        { provide: CATEGORY_CATALOG, useClass: MockCategoryCatalogService },
        { provide: AUTH_SERVICE, useClass: MockAuthService },
        { provide: WISHLIST_SERVICE, useClass: MockWishlistService }
      ]
    }).compileComponents();
  });

  it('lists all products with a category filter on /shop', async () => {
    const fixture = TestBed.createComponent(Shop);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.shop__title')?.textContent).toContain('All Products');
    expect(compiled.querySelectorAll('app-product-card').length).toBeGreaterThan(0);
    expect(compiled.querySelectorAll('.shop__chip').length).toBeGreaterThan(1);
  });

  it('only lists products from the category in the slug', async () => {
    const category = await new Promise((resolve) =>
      TestBed.inject(CATEGORY_CATALOG).getCategoryBySlug('lighting').subscribe(resolve)
    );
    const inCategory = await new Promise<unknown[]>((resolve) =>
      TestBed.inject(PRODUCT_CATALOG)
        .getProducts({ categoryId: (category as { id: string }).id })
        .subscribe(resolve)
    );

    const fixture = TestBed.createComponent(Shop);
    fixture.componentRef.setInput('slug', 'lighting');
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.shop__title')?.textContent).toContain('Lighting');
    expect(compiled.querySelectorAll('app-product-card').length).toBe(inCategory.length);
  });

  it('shows a not-found state for an unknown category', async () => {
    const fixture = TestBed.createComponent(Shop);
    fixture.componentRef.setInput('slug', 'does-not-exist');
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.shop__title')?.textContent).toContain('Category not found');
    expect(compiled.querySelector('app-product-card')).toBeNull();
  });

  it('pages through products with "Load more"', async () => {
    const catalog = TestBed.inject(PRODUCT_CATALOG);
    const all = await new Promise<unknown[]>((resolve) => catalog.getProducts().subscribe(resolve));
    const spy = vi.spyOn(catalog, 'getProducts');

    const fixture = TestBed.createComponent(Shop);
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: 12 }));

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.shop__more-button') as HTMLButtonElement | null;

    // "Load more" is offered whenever a full page came back, so an exact multiple of the page
    // size shows it once more and the (empty) next page then hides it.
    expect(button === null).toBe(all.length < 12);

    if (button) {
      button.click();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ page: 2, limit: 12 }));
      expect(compiled.querySelectorAll('app-product-card').length).toBe(all.length);
      expect(compiled.querySelector('.shop__more-button')).toBeNull();
    }
  });
});
