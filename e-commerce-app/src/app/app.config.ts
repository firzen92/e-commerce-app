import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { CATEGORY_CATALOG, HttpCategoryCatalogService, HttpProductCatalogService, PRODUCT_CATALOG } from './core/services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    { provide: PRODUCT_CATALOG, useClass: HttpProductCatalogService },
    { provide: CATEGORY_CATALOG, useClass: HttpCategoryCatalogService }
  ]
};
