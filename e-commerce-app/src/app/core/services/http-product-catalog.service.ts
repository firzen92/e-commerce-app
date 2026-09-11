import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../models';
import { mapProductApiModelToProduct, PaginatedApiResult, ProductApiModel } from '../api';
import { ProductCatalog, ProductQuery } from '../interfaces';

@Injectable()
export class HttpProductCatalogService implements ProductCatalog {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/products`;

  getProducts(query?: ProductQuery): Observable<Product[]> {
    let params = new HttpParams();

    if (query?.categoryId) {
      params = params.set('categoryId', query.categoryId);
    }

    if (query?.featuredOnly) {
      params = params.set('featuredOnly', String(query.featuredOnly));
    }

    if (query?.searchTerm) {
      params = params.set('searchTerm', query.searchTerm);
    }

    return this.http
      .get<PaginatedApiResult<ProductApiModel>>(this.baseUrl, { params })
      .pipe(map((result) => result.data.map(mapProductApiModelToProduct)));
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.http.get<ProductApiModel>(`${this.baseUrl}/${slug}`).pipe(
      map((apiModel) => mapProductApiModelToProduct(apiModel)),
      catchError(() => of(undefined)),
    );
  }

  getFeaturedProducts(limit = 8): Observable<Product[]> {
    const params = new HttpParams().set('featuredOnly', 'true').set('limit', String(limit));

    return this.http
      .get<PaginatedApiResult<ProductApiModel>>(this.baseUrl, { params })
      .pipe(map((result) => result.data.map(mapProductApiModelToProduct)));
  }
}
