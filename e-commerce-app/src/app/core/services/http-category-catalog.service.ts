import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../../models';
import { CategoryApiModel, mapCategoryApiModelToCategory } from '../api';
import { CategoryCatalog } from '../interfaces';

@Injectable()
export class HttpCategoryCatalogService implements CategoryCatalog {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/categories`;

  getCategories(): Observable<Category[]> {
    return this.http
      .get<CategoryApiModel[]>(this.baseUrl)
      .pipe(map((apiModels) => apiModels.map(mapCategoryApiModelToCategory)));
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    return this.http.get<CategoryApiModel>(`${this.baseUrl}/${slug}`).pipe(
      map((apiModel) => mapCategoryApiModelToCategory(apiModel)),
      catchError(() => of(undefined)),
    );
  }
}
