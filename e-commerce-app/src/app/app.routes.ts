import { Routes } from '@angular/router';
import { authGuard } from './core/guards';

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
    path: 'wishlist',
    canActivate: [authGuard],
    loadChildren: () => import('./features/wishlist/wishlist.routes').then((m) => m.WISHLIST_ROUTES)
  },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
