export interface Environment {
  readonly production: boolean;
  readonly apiBaseUrl: string;
  /** Supabase project URL, used by the frontend to talk to Supabase Auth directly. */
  readonly supabaseUrl: string;
  /** Supabase anon/public key — safe for client-side use, access is enforced via RLS policies. */
  readonly supabaseAnonKey: string;
}
