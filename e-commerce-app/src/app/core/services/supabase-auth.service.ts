import { Injectable, OnDestroy, signal } from '@angular/core';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { from, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthCredentials, AuthService, AuthSignUpResult } from '../interfaces';
import { AuthUser } from '../../models';

function toAuthUser(session: Session | null): AuthUser | null {
  const email = session?.user?.email;
  return email ? { id: session.user.id, email } : null;
}

/** `AuthService` backed by Supabase Auth — the frontend talks to Supabase directly, the API only verifies the resulting JWT. */
@Injectable()
export class SupabaseAuthService implements AuthService, OnDestroy {
  private readonly client: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseAnonKey
  );
  private readonly authStateSubscription = this.client.auth.onAuthStateChange((_event, session) => {
    this.userSignal.set(toAuthUser(session));
  });

  private readonly userSignal = signal<AuthUser | null | undefined>(undefined);
  readonly currentUser = this.userSignal.asReadonly();

  constructor() {
    this.client.auth.getSession().then(({ data }) => this.userSignal.set(toAuthUser(data.session)));
  }

  signIn(credentials: AuthCredentials): Observable<AuthUser> {
    return from(this.client.auth.signInWithPassword(credentials)).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }

        const user = toAuthUser(data.session);
        if (!user) {
          throw new Error('Sign-in did not return a session.');
        }

        return user;
      })
    );
  }

  signUp(credentials: AuthCredentials): Observable<AuthSignUpResult> {
    return from(this.client.auth.signUp(credentials)).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }

        if (!data.user?.email) {
          throw new Error('Registration did not return a user.');
        }

        return {
          user: { id: data.user.id, email: data.user.email },
          requiresEmailConfirmation: !data.session
        };
      })
    );
  }

  signOut(): Observable<void> {
    return from(this.client.auth.signOut()).pipe(
      map(({ error }) => {
        if (error) {
          throw error;
        }
      })
    );
  }

  getAccessToken(): Observable<string | null> {
    return from(this.client.auth.getSession()).pipe(
      map(({ data }) => data.session?.access_token ?? null)
    );
  }

  ngOnDestroy(): void {
    this.authStateSubscription.data.subscription.unsubscribe();
  }
}
