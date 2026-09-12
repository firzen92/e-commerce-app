-- Wishlist schema, matching:
--   e-commerce-app: src/app/models/wishlist.model.ts
--   e-commerce-api: src/modules/wishlist/interfaces/wishlist.repository.interface.ts

create table if not exists wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists wishlist_items_user_id_idx on wishlist_items (user_id);

alter table wishlist_items enable row level security;

-- The API talks to Supabase with the service-role key (bypasses RLS) and scopes every
-- query by the authenticated user's id itself, but these policies keep the table safe
-- by default if it's ever queried with a user-scoped key instead.
create policy "Users can view their own wishlist items"
  on wishlist_items for select
  using (auth.uid() = user_id);

create policy "Users can add their own wishlist items"
  on wishlist_items for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own wishlist items"
  on wishlist_items for delete
  using (auth.uid() = user_id);
