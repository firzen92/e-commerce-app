import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import {
  AUTH_SERVICE,
  CATEGORY_CATALOG,
  MockAuthService,
  MockCategoryCatalogService,
  MockProductCatalogService,
  PRODUCT_CATALOG
} from './core/services';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        { provide: PRODUCT_CATALOG, useClass: MockProductCatalogService },
        { provide: CATEGORY_CATALOG, useClass: MockCategoryCatalogService },
        { provide: AUTH_SERVICE, useClass: MockAuthService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the navbar brand', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.navbar__brand')?.textContent).toContain('Aurelia');
  });
});
