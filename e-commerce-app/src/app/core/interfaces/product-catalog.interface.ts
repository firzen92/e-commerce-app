import { Observable } from 'rxjs';
import { Category, Product } from '../../models';

export interface ProductQuery {
  readonly categoryId?: string;
  readonly featuredOnly?: boolean;
  readonly searchTerm?: string;
  /** 1-based page number; only applied together with `limit`. */
  readonly page?: number;
  readonly limit?: number;
}

export interface ProductCatalog {
  getProducts(query?: ProductQuery): Observable<Product[]>;
  getProductBySlug(slug: string): Observable<Product | undefined>;
  getFeaturedProducts(limit?: number): Observable<Product[]>;
}

export interface CategoryCatalog {
  getCategories(): Observable<Category[]>;
  getCategoryBySlug(slug: string): Observable<Category | undefined>;
}
