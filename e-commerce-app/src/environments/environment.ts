import type { Environment } from './environment.type';

export const environment: Environment = {
  production: true,
  apiBaseUrl: 'https://api.example.com/v1',
  // Replace with the production Supabase project's URL and anon key before deploying.
  supabaseUrl: 'https://your-project-ref.supabase.co',
  supabaseAnonKey: 'your-anon-key'
};
