import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../../models';
import { ProductCatalog, ProductQuery } from '../interfaces';
import productsMock from '../../data/mock/products.mock.json';

@Injectable()
export class MockProductCatalogService implements ProductCatalog {
  private readonly products: Product[] = productsMock as Product[];

  getProducts(query?: ProductQuery): Observable<Product[]> {
    let results = this.products;

    if (query?.categoryId) {
      results = results.filter((product) => product.categoryId === query.categoryId);
    }

    if (query?.featuredOnly) {
      results = results.filter((product) => product.isFeatured);
    }

    if (query?.searchTerm) {
      const term = query.searchTerm.toLowerCase();
      results = results.filter((product) => product.name.toLowerCase().includes(term));
    }

    return of(results);
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return of(this.products.find((product) => product.slug === slug));
  }

  getFeaturedProducts(limit = 8): Observable<Product[]> {
    return of(this.products.filter((product) => product.isFeatured).slice(0, limit));
  }
}
