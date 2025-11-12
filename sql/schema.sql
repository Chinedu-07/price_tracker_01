-- Supabase SQL for tables

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name_normalized text not null,
  name_display text not null,
  current_price numeric not null,
  previous_price numeric,
  is_deleted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on items(user_id);
create index on items(name_normalized);

create table if not exists price_history (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references items(id) on delete cascade,
  price numeric not null,
  recorded_at timestamptz default now()
);

create index on price_history(item_id);
