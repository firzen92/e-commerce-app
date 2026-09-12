import { MockAuthService } from './mock-auth.service';

describe('MockAuthService', () => {
  let service: MockAuthService;

  beforeEach(() => {
    service = new MockAuthService();
  });

  it('starts signed out', () => {
    expect(service.currentUser()).toBeNull();
  });

  it('signs in and exposes the current user', async () => {
    const user = await new Promise((resolve) =>
      service.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe(resolve)
    );

    expect(user).toEqual({ id: 'mock-user-id', email: 'shopper@example.com' });
    expect(service.currentUser()).toEqual({ id: 'mock-user-id', email: 'shopper@example.com' });
  });

  it('signs out and clears the current user', async () => {
    await new Promise((resolve) =>
      service.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe(resolve)
    );

    await new Promise((resolve) => service.signOut().subscribe(resolve));

    expect(service.currentUser()).toBeNull();
  });

  it('resolves an access token only while signed in', async () => {
    expect(await new Promise((resolve) => service.getAccessToken().subscribe(resolve))).toBeNull();

    await new Promise((resolve) =>
      service.signIn({ email: 'shopper@example.com', password: 'password123' }).subscribe(resolve)
    );

    expect(await new Promise((resolve) => service.getAccessToken().subscribe(resolve))).toBe(
      'mock-access-token'
    );
  });
});
