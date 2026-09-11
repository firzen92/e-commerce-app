import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../../models';
import { CategoryCatalog } from '../interfaces';
import categoriesMock from '../../data/mock/categories.mock.json';

@Injectable()
export class MockCategoryCatalogService implements CategoryCatalog {
  private readonly categories: Category[] = categoriesMock as Category[];

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    return of(this.categories.find((category) => category.slug === slug));
  }
}
