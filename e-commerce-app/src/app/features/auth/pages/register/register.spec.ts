import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../../../app.routes';
import { AUTH_SERVICE, MockAuthService } from '../../../../core/services';
import { Register } from './register';

describe('Register', () => {
  let authService: MockAuthService;

  beforeEach(async () => {
    authService = new MockAuthService();

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter(routes), { provide: AUTH_SERVICE, useValue: authService }]
    }).compileComponents();
  });

  it('flags mismatched passwords', async () => {
    const fixture = TestBed.createComponent(Register);
    const component = fixture.componentInstance;
    await fixture.whenStable();

    component['form'].setValue({
      email: 'shopper@example.com',
      password: 'password123',
      confirmPassword: 'something-else'
    });
    component['form'].markAllAsTouched();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.auth-form__error')?.textContent).toContain(
      'Passwords do not match'
    );
  });

  it('shows a confirmation message after a successful sign-up', async () => {
    const fixture = TestBed.createComponent(Register);
    const component = fixture.componentInstance;
    await fixture.whenStable();

    component['form'].setValue({
      email: 'shopper@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component['onSubmit']();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.auth-card__title')?.textContent).toContain('Check your inbox');
  });
});
