import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { SupabaseConfig } from '../../../config';
import { AuthenticatedUser, SupabaseJwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const { url } = configService.getOrThrow<SupabaseConfig>('supabase');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Supabase now signs access tokens with an asymmetric key (ES256 by default, RS256 also
      // supported) rather than the legacy shared "JWT Secret". Verify against the project's
      // published JWKS instead of a static secret, resolving the right key by the token's `kid`.
      //
      // `algorithms` is deliberately asymmetric-only (no 'HS256'/'none'): jwks-rsa only ever
      // returns public keys here, and allowing a symmetric algorithm alongside a JWKS-sourced
      // key would open an algorithm-confusion attack (an attacker-forged HS256 token signed
      // with the — public — key bytes as the HMAC secret).
      algorithms: ['ES256', 'RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        cacheMaxAge: 10 * 60 * 1000, // 10 minutes
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${url}/auth/v1/.well-known/jwks.json`,
      }),
    });
  }

  validate(payload: SupabaseJwtPayload): AuthenticatedUser {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
