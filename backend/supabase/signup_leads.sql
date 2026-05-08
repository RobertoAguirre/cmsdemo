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
