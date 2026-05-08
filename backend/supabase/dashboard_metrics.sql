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
