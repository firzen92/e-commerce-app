import { InjectionToken } from '@angular/core';
import { AuthService, CategoryCatalog, ProductCatalog } from '../interfaces';

export const PRODUCT_CATALOG = new InjectionToken<ProductCatalog>('PRODUCT_CATALOG');
export const CATEGORY_CATALOG = new InjectionToken<CategoryCatalog>('CATEGORY_CATALOG');
export const AUTH_SERVICE = new InjectionToken<AuthService>('AUTH_SERVICE');
