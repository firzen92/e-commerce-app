import { Routes } from '@angular/router';

export const WISHLIST_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/wishlist/wishlist').then((m) => m.Wishlist),
    title: 'Aurelia — Wishlist'
  }
];
