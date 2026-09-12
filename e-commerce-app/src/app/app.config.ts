import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors';
import {
  AUTH_SERVICE,
  CATEGORY_CATALOG,
  HttpCategoryCatalogService,
  HttpProductCatalogService,
  PRODUCT_CATALOG,
  SupabaseAuthService
} from './core/services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    { provide: PRODUCT_CATALOG, useClass: HttpProductCatalogService },
    { provide: CATEGORY_CATALOG, useClass: HttpCategoryCatalogService },
    { provide: AUTH_SERVICE, useClass: SupabaseAuthService }
  ]
};
