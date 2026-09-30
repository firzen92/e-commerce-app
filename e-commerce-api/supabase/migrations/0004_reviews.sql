-- Reviews schema, matching:
--   e-commerce-app: src/app/models/review.model.ts
--   e-commerce-api: src/modules/reviews/interfaces/review.interface.ts

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create index if not exists reviews_product_id_idx on reviews (product_id);

create trigger reviews_set_updated_at
  before update on reviews
  for each row
  execute function set_updated_at();

-- Keeps products.rating_average/rating_count as a live aggregate of this table instead of
-- static seed data, and does it in the database so it can't drift from application code.
-- The API always writes through the service-role key (bypasses RLS on both tables), so this
-- trigger never needs to be SECURITY DEFINER.
create or replace function recompute_product_rating()
returns trigger
language plpgsql
as $$
declare
  affected_product_id uuid := coalesce(new.product_id, old.product_id);
begin
  update products
  set
    rating_average = (
      select round(avg(rating)::numeric, 1) from reviews where product_id = affected_product_id
    ),
    rating_count = (
      select count(*) from reviews where product_id = affected_product_id
    )
  where id = affected_product_id;

  return null;
end;
$$;

create trigger reviews_recompute_product_rating
  after insert or update or delete on reviews
  for each row
  execute function recompute_product_rating();

alter table reviews enable row level security;

-- The API talks to Supabase with the service-role key (bypasses RLS) and scopes every
-- write by the authenticated user's id itself, but these policies keep the table safe
-- by default if it's ever queried with a user-scoped key instead.
create policy "Reviews are viewable by everyone"
  on reviews for select
  using (true);

create policy "Users can create their own reviews"
  on reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on reviews for delete
  using (auth.uid() = user_id);
