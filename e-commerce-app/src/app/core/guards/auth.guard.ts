import { toObservable } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AUTH_SERVICE } from '../services';

/** Blocks routes behind sign-in, redirecting to `/login` with a `returnUrl` when there's no session. */
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AUTH_SERVICE);
  const router = inject(Router);

  return toObservable(authService.currentUser).pipe(
    filter((user) => user !== undefined),
    take(1),
    map(
      (user) =>
        user !== null || router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })
    )
  );
};
