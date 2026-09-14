import type { Environment } from './environment.type';

export const environment: Environment = {
  production: true,
  apiBaseUrl: 'https://e-commerce-app-be-0p5t.onrender.com/v1',
  // Replace with the production Supabase project's URL and anon key before deploying.
  supabaseUrl: 'https://your-project-ref.supabase.co',
  supabaseAnonKey: 'your-anon-key'
};
