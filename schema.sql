-- Esquema inicial PostgreSQL para MVP de reservas

create extension if not exists "pgcrypto";

create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  address text,
  timezone text not null default 'America/Santiago',
  currency text not null default 'CLP',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table users (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  full_name text not null,
  email text not null,
  password_hash text not null,
  role text not null check (role in ('owner', 'admin', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, email)
);

create table professionals (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  category text,
  duration_minutes integer not null check (duration_minutes > 0),
  price numeric(12,2) not null check (price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table professional_services (
  professional_id uuid not null references professionals(id) on delete cascade,
  service_id uuid not null references services(id) on delete cascade,
  primary key (professional_id, service_id)
);

create table professional_schedules (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references professionals(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, phone)
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete restrict,
  professional_id uuid not null references professionals(id) on delete restrict,
  service_id uuid not null references services(id) on delete restrict,
  source text not null check (source in ('manual', 'web', 'whatsapp')),
  status text not null check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table reminders (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references appointments(id) on delete cascade,
  channel text not null check (channel in ('email', 'whatsapp')),
  scheduled_for timestamptz not null,
  status text not null check (status in ('pending', 'sent', 'failed')),
  provider_message_id text,
  created_at timestamptz not null default now()
);

create index idx_professional_schedule on professional_schedules (professional_id, day_of_week);
create index idx_appointments_business_time on appointments (business_id, starts_at);
create index idx_appointments_professional_time on appointments (professional_id, starts_at);
create index idx_appointments_customer on appointments (customer_id, starts_at desc);
create index idx_reminders_scheduled on reminders (status, scheduled_for);

