import { Routes } from '@angular/router';

export const SHOP_ROUTES: Routes = [
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop),
    title: 'Aurelia — Shop'
  },
  {
    path: 'category/:slug',
    loadComponent: () => import('./pages/shop/shop').then((m) => m.Shop),
    title: 'Aurelia — Shop by Category'
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('../home/components/categories/categories').then((m) => m.Categories),
    title: 'Aurelia — Categories'
  }
];
