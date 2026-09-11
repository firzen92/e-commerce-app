import { Routes } from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: ':slug',
    loadComponent: () => import('./pages/product-detail/product-detail').then((m) => m.ProductDetail)
  }
];
