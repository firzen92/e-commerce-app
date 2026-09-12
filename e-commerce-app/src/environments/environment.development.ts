import type { Environment } from './environment.type';

export const environment: Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/v1',
  // Same Supabase project the API's SUPABASE_URL points at (see e-commerce-api/.env.example).
  // The anon key is safe to keep here — access is enforced by Supabase RLS policies, not secrecy.
  supabaseUrl: 'https://hzaueiyptwwmkyhcwuko.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6YXVlaXlwdHd3bWt5aGN3dWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwODc5OTYsImV4cCI6MjEwMTY2Mzk5Nn0.aaa_tXNCwLZwLO63Fc2Rs_gJp0uSrdkziHo2wR6nRPA'
};
