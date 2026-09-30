import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review, SubmitReviewInput } from '../../models';
import { ReviewsCatalog } from '../interfaces';

@Injectable()
export class HttpReviewsCatalogService implements ReviewsCatalog {
  private readonly http = inject(HttpClient);

  getReviews(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiBaseUrl}/products/${productId}/reviews`);
  }

  submitReview(productId: string, input: SubmitReviewInput): Observable<Review> {
    return this.http.post<Review>(`${environment.apiBaseUrl}/products/${productId}/reviews`, input);
  }

  deleteReview(productId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/products/${productId}/reviews`);
  }
}
