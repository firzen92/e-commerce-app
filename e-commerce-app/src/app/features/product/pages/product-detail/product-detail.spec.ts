import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../../../app.routes';
import { PRODUCT_CATALOG, MockProductCatalogService } from '../../../../core/services';
import { CartService } from '../../../../state/cart.service';
import { ProductDetail } from './product-detail';

describe('ProductDetail', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [provideRouter(routes), { provide: PRODUCT_CATALOG, useClass: MockProductCatalogService }]
    }).compileComponents();
  });

  it('shows the product once the lookup resolves', async () => {
    const fixture = TestBed.createComponent(ProductDetail);
    fixture.componentRef.setInput('slug', 'aria-lounge-chair');
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.product-detail__name')?.textContent).toContain('Aria Lounge Chair');
  });

  it('shows a not-found state for an unknown slug', async () => {
    const fixture = TestBed.createComponent(ProductDetail);
    fixture.componentRef.setInput('slug', 'does-not-exist');
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.product-detail__status--empty')?.textContent).toContain('Product not found');
  });

  it('switches the gallery image when a thumbnail is clicked', async () => {
    const fixture = TestBed.createComponent(ProductDetail);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('slug', 'aria-lounge-chair');
    await fixture.whenStable();

    expect(component['selectedImageIndex']()).toBe(0);
  });

  it('adds the product to the cart and shows a confirmation', async () => {
    const fixture = TestBed.createComponent(ProductDetail);
    fixture.componentRef.setInput('slug', 'aria-lounge-chair');
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.product-detail__cart-notice')).toBeNull();

    (compiled.querySelector('.product-detail__add-to-cart') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(compiled.querySelector('.product-detail__cart-notice')?.textContent).toContain('Added 1 to your cart');

    const cartService = TestBed.inject(CartService);
    expect(cartService.items().map((item) => item.product.slug)).toEqual(['aria-lounge-chair']);
  });

  it('adds the selected quantity when the stepper is used', async () => {
    const fixture = TestBed.createComponent(ProductDetail);
    fixture.componentRef.setInput('slug', 'aria-lounge-chair');
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const [decrementButton, incrementButton] = Array.from(
      compiled.querySelectorAll<HTMLButtonElement>('.product-detail__quantity button')
    );

    incrementButton.click();
    incrementButton.click();
    await fixture.whenStable();
    expect(compiled.querySelector('.product-detail__quantity-value')?.textContent).toContain('3');

    decrementButton.click();
    await fixture.whenStable();
    expect(compiled.querySelector('.product-detail__quantity-value')?.textContent).toContain('2');

    (compiled.querySelector('.product-detail__add-to-cart') as HTMLButtonElement).click();
    await fixture.whenStable();

    const cartService = TestBed.inject(CartService);
    expect(cartService.items()[0].quantity).toBe(2);
  });
});
