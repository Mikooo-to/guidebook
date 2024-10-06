-- schema.sql
create schema if not exists "public";

set search_path to "public";
-- GENERAL ------------------------------------------------------------

create or replace function random_between(low int ,high int)
   returns int AS
$$
begin
   return floor(random()* (high-low + 1) + low);
END;
$$ language 'plpgsql' STRICT;

-- VERSION CONTROL ---------------------------------------------------

-- reference table
create table  if not exists database_version_control (
  id bigserial primary key,
  version bigint not null,
  completed timestamp default current_timestamp
);

-- USERS ---------------------------------------------------------

create table  if not exists users (
  id bigserial primary key,
  active BOOL not null default TRUE,
  email varchar(255) unique not null,
  is_email_verified bool not null default false,
  password varchar(128) not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  deleted_at timestamp default null
);

create table  if not exists articles(
  id bigserial primary key,
  user_id bigint not null references users(id),
  avatar varchar(64) not null,
  url varchar(128),
  created_at timestamp not null default CURRENT_TIMESTAMP
);
