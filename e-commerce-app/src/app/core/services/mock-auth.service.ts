import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthCredentials, AuthService, AuthSignUpResult } from '../interfaces';
import { AuthUser } from '../../models';

/** In-memory `AuthService` for tests and local development without a Supabase project. */
@Injectable()
export class MockAuthService implements AuthService {
  private readonly userSignal = signal<AuthUser | null | undefined>(null);
  readonly currentUser = this.userSignal.asReadonly();

  signIn(credentials: AuthCredentials): Observable<AuthUser> {
    const user: AuthUser = { id: 'mock-user-id', email: credentials.email };
    this.userSignal.set(user);
    return of(user);
  }

  signUp(credentials: AuthCredentials): Observable<AuthSignUpResult> {
    const user: AuthUser = { id: 'mock-user-id', email: credentials.email };
    this.userSignal.set(user);
    return of({ user, requiresEmailConfirmation: false });
  }

  signOut(): Observable<void> {
    this.userSignal.set(null);
    return of(undefined);
  }

  getAccessToken(): Observable<string | null> {
    return of(this.userSignal() ? 'mock-access-token' : null);
  }
}
