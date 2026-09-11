import { registerAs } from '@nestjs/config';

export interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
  jwtSecret: string;
}

export default registerAs('supabase', (): SupabaseConfig => ({
  url: process.env['SUPABASE_URL'] ?? '',
  serviceRoleKey: process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '',
  jwtSecret: process.env['SUPABASE_JWT_SECRET'] ?? '',
}));
