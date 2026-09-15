-- Orders schema, matching:
--   e-commerce-app: src/app/models/order.model.ts
--   e-commerce-api: src/modules/orders/interfaces/order.interface.ts

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded')),
  line_items jsonb not null,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  total_currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on orders (user_id);

create trigger orders_set_updated_at
  before update on orders
  for each row
  execute function set_updated_at();

alter table orders enable row level security;

-- The API talks to Supabase with the service-role key (bypasses RLS) and scopes every
-- query by the authenticated user's id itself, but these policies keep the table safe
-- by default if it's ever queried with a user-scoped key instead.
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users can create their own orders"
  on orders for insert
  with check (auth.uid() = user_id);
