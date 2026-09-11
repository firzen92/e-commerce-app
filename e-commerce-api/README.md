# E-Commerce API

NestJS backend for the Angular e-commerce storefront, backed by Supabase (Postgres + Auth).

## Architecture

- `src/config` — env validation (`class-validator`) and typed config namespaces (`registerAs`)
- `src/supabase` — global `SupabaseModule` providing a typed `SupabaseClient` behind the `SUPABASE_CLIENT` injection token
- `src/common` — cross-cutting concerns: global exception filter, logging interceptor, pagination DTO, shared interfaces
- `src/modules/auth` — verifies Supabase-issued JWTs (`passport-jwt`), exposes `@Public()`, `@Roles()`, `@CurrentUser()` decorators, and a global `JwtAuthGuard` (routes require auth unless marked `@Public()`)
- `src/modules/products` — product catalog, repository pattern behind `PRODUCTS_REPOSITORY`
- `src/modules/orders` — user-scoped orders, repository pattern behind `ORDERS_REPOSITORY`

Each feature module follows: `controller` → `service` → repository interface → Supabase-backed repository implementation. Swapping the data layer (e.g. adding a cache, or moving a module off Supabase) only requires a new class bound to the same injection token.

## Prerequisites

- Node.js (see `.nvmrc` / root `package.json` engines if present)
- A Supabase project (Project Settings → API for URL, service role key, and JWT secret)

## Setup

```bash
yarn install
cp .env.example .env
# fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET
```

## Running

```bash
yarn start:dev   # watch mode
yarn build && yarn start:prod
```

The API listens on `PORT` (default `3000`) under `/v1` (URI versioning). Swagger docs are served at `/docs`.

## Testing

```bash
yarn test        # unit tests
yarn test:e2e     # e2e tests
yarn lint
```

## Adding a new feature module

1. Create `src/modules/<feature>/{dto,interfaces,repositories}`.
2. Define the repository contract as an interface + `Symbol` token in `interfaces/`.
3. Implement it against Supabase in `repositories/`.
4. Add a thin `*.service.ts` that depends on the interface (via `@Inject(TOKEN)`), never the concrete class.
5. Add a `*.controller.ts`; mark read-only/public endpoints with `@Public()`, leave everything else behind the default auth guard.
6. Register the module in `app.module.ts`.
