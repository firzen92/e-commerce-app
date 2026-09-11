-- Categories and products schema, matching:
--   e-commerce-app: src/app/models/{category,product}.model.ts
--   e-commerce-api: src/modules/products/interfaces/product.interface.ts

create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- categories -----------------------------------------------------------

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger categories_set_updated_at
  before update on categories
  for each row
  execute function set_updated_at();

alter table categories enable row level security;

create policy "Categories are viewable by everyone"
  on categories for select
  using (true);

-- products ---------------------------------------------------------------

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  price_amount numeric(10, 2) not null check (price_amount >= 0),
  price_currency text not null default 'USD',
  compare_at_price_amount numeric(10, 2) check (compare_at_price_amount >= 0),
  category_id uuid not null references categories (id) on delete restrict,
  images jsonb not null default '[]'::jsonb,
  rating_average numeric(2, 1) check (rating_average between 0 and 5),
  rating_count integer check (rating_count >= 0),
  in_stock boolean not null default true,
  quantity integer check (quantity >= 0),
  tags text[],
  is_featured boolean not null default false,
  is_new boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on products (category_id);
create index if not exists products_is_featured_idx on products (is_featured) where is_featured = true;
create index if not exists products_name_trgm_idx on products using gin (to_tsvector('english', name));

create trigger products_set_updated_at
  before update on products
  for each row
  execute function set_updated_at();

alter table products enable row level security;

create policy "Products are viewable by everyone"
  on products for select
  using (true);
