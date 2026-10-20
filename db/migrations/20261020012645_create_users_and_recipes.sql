create table if not exists users (
  id serial primary key,
  email text not null unique,
  password_hash text not null,
  name text not null,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now()
);
create table if not exists recipes (
  id serial primary key,
  user_id integer not null references users(id) on delete cascade,
  title text not null,
  cuisine text not null,
  description text,
  ingredients text not null,
  steps text not null,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists recipes_user_id_idx on recipes(user_id);
create index if not exists recipes_cuisine_idx on recipes(cuisine);
create index if not exists recipes_created_at_idx on recipes(created_at desc);
