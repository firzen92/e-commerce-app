import { registerAs } from '@nestjs/config';

export interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
}

export default registerAs('supabase', (): SupabaseConfig => ({
  url: process.env['SUPABASE_URL'] ?? '',
  serviceRoleKey: process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '',
}));
