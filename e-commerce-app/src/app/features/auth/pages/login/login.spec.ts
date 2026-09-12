import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable } from 'rxjs';
import { routes } from '../../../../app.routes';
import { AUTH_SERVICE, MockAuthService } from '../../../../core/services';
import { Login } from './login';

describe('Login', () => {
  let authService: MockAuthService;

  beforeEach(async () => {
    authService = new MockAuthService();

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter(routes), { provide: AUTH_SERVICE, useValue: authService }]
    }).compileComponents();
  });

  it('shows validation errors when submitted empty', async () => {
    const fixture = TestBed.createComponent(Login);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('form') as HTMLFormElement).requestSubmit();
    await fixture.whenStable();

    expect(compiled.querySelectorAll('.auth-form__error').length).toBeGreaterThan(0);
  });

  it('signs in and redirects on valid credentials', async () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    await fixture.whenStable();

    component['form'].setValue({ email: 'shopper@example.com', password: 'password123' });
    const signInSpy = vi.spyOn(authService, 'signIn');

    component['onSubmit']();
    await fixture.whenStable();

    expect(signInSpy).toHaveBeenCalledWith({
      email: 'shopper@example.com',
      password: 'password123'
    });
    expect(authService.currentUser()?.email).toBe('shopper@example.com');
  });

  it('surfaces an error message when sign-in fails', async () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    await fixture.whenStable();

    vi.spyOn(authService, 'signIn').mockReturnValueOnce(
      new Observable((subscriber) => subscriber.error(new Error('Invalid login credentials.')))
    );

    component['form'].setValue({ email: 'shopper@example.com', password: 'wrong-password' });
    component['onSubmit']();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.auth-form__banner--error')?.textContent).toContain(
      'Invalid login credentials.'
    );
  });
});
