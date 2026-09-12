import { ConfigService } from '@nestjs/config';
import * as passportJwtModule from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { JwtStrategy } from './jwt.strategy';

jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn(() => jest.fn()),
}));

function buildConfigService(url: string): ConfigService {
  return {
    getOrThrow: () => ({ url, serviceRoleKey: 'service-role-key' }),
  } as unknown as ConfigService;
}

describe('JwtStrategy', () => {
  let strategyConstructorSpy: jest.SpyInstance;

  beforeEach(() => {
    strategyConstructorSpy = jest.spyOn(passportJwtModule, 'Strategy');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('resolves signing keys from the project JWKS endpoint, not a static secret', () => {
    new JwtStrategy(buildConfigService('https://project-ref.supabase.co'));

    expect(passportJwtSecret).toHaveBeenCalledWith(
      expect.objectContaining({
        jwksUri:
          'https://project-ref.supabase.co/auth/v1/.well-known/jwks.json',
      }),
    );
  });

  it('only allows asymmetric algorithms, never a symmetric one alongside the JWKS-sourced key', () => {
    // Regression test for the algorithm-confusion class of bug: a JWKS-sourced key must never be
    // paired with 'HS256'/'none' in the allow-list, or a forged HS256 token signed with the
    // (public) key bytes as the HMAC secret would verify successfully.
    new JwtStrategy(buildConfigService('https://project-ref.supabase.co'));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- jest spy call args are untyped by design
    const options = strategyConstructorSpy.mock.calls[0][0] as {
      algorithms: string[];
    };
    expect(options.algorithms).toEqual(
      expect.arrayContaining(['ES256', 'RS256']),
    );
    expect(options.algorithms).not.toContain('HS256');
    expect(options.algorithms).not.toContain('none');
  });

  describe('validate', () => {
    it('maps the Supabase JWT payload to an AuthenticatedUser', () => {
      const strategy = new JwtStrategy(
        buildConfigService('https://project-ref.supabase.co'),
      );

      const user = strategy.validate({
        sub: 'user-1',
        email: 'shopper@example.com',
        role: 'authenticated',
        aud: 'authenticated',
        exp: 0,
        iat: 0,
      });

      expect(user).toEqual({
        id: 'user-1',
        email: 'shopper@example.com',
        role: 'authenticated',
      });
    });
  });
});
