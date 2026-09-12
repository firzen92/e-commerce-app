import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUser } from '../../models';

export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
}

export interface AuthSignUpResult {
  readonly user: AuthUser;
  /** True when Supabase requires the user to confirm their email before a session is issued. */
  readonly requiresEmailConfirmation: boolean;
}

export interface AuthService {
  /** `undefined` while the session is still being restored, `null` once resolved with no signed-in user. */
  readonly currentUser: Signal<AuthUser | null | undefined>;
  signIn(credentials: AuthCredentials): Observable<AuthUser>;
  signUp(credentials: AuthCredentials): Observable<AuthSignUpResult>;
  signOut(): Observable<void>;
  /** Current Supabase access token, or `null` when signed out. Used by the auth HTTP interceptor. */
  getAccessToken(): Observable<string | null>;
}
