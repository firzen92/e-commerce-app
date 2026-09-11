export type AppRole = 'authenticated' | 'anon' | 'service_role';

export interface SupabaseJwtPayload {
  sub: string;
  email?: string;
  role: AppRole;
  aud: string;
  exp: number;
  iat: number;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}
