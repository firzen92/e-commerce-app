import { AppRole } from './supabase-jwt-payload.interface';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role: AppRole;
}
