create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan text not null default 'starter' check (plan in ('starter', 'growth', 'scale', 'enterprise')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'editor' check (role in ('owner', 'admin', 'editor', 'author', 'viewer')),
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  slug text not null,
  content_type text not null check (content_type in ('pagina', 'blog', 'landing', 'producto')),
  body text not null,
  seo jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'review', 'scheduled', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_content_items_updated_at on public.content_items;
create trigger trg_content_items_updated_at
before update on public.content_items
for each row
execute function public.set_updated_at();

drop trigger if exists trg_tenants_updated_at on public.tenants;
create trigger trg_tenants_updated_at
before update on public.tenants
for each row
execute function public.set_updated_at();

create index if not exists idx_tenant_memberships_user_id on public.tenant_memberships(user_id);
create index if not exists idx_content_items_tenant_id on public.content_items(tenant_id);

create table if not exists public.signup_leads (
  id uuid primary key default gen_random_uuid(),
  nombre_completo text not null,
  correo_laboral text not null,
  empresa_proyecto text not null,
  tipo_negocio text not null check (tipo_negocio in ('saas', 'ecommerce', 'agency', 'corp')),
  auth_user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_signup_leads_correo_lower on public.signup_leads (lower(correo_laboral));

create table if not exists public.monitored_sites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  nombre text not null,
  dominio text not null,
  plataforma text not null check (plataforma in ('web', 'ios', 'android')),
  status text not null default 'active' check (status in ('active', 'paused')),
  tracking_key text not null unique,
  created_at timestamptz not null default now(),
  unique (tenant_id, dominio)
);

create table if not exists public.site_metrics_daily (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  site_id uuid not null references public.monitored_sites(id) on delete cascade,
  metric_date date not null,
  leads integer not null default 0,
  reactions integer not null default 0,
  sessions integer not null default 0,
  total_time_seconds integer not null default 0,
  created_at timestamptz not null default now(),
  unique (site_id, metric_date)
);

create index if not exists idx_monitored_sites_tenant_id on public.monitored_sites(tenant_id);
create index if not exists idx_site_metrics_daily_tenant_date on public.site_metrics_daily(tenant_id, metric_date);
