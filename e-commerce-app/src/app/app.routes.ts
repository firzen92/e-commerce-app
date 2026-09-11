import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES)
  },
  {
    path: 'products',
    loadChildren: () => import('./features/product/product.routes').then((m) => m.PRODUCT_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
