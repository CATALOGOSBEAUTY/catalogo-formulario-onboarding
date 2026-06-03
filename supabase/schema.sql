create extension if not exists "pgcrypto";

create table if not exists public.onboarding_submissions (
  id uuid primary key default gen_random_uuid(),

  -- Steps 01-03: Identidade e Localizacao
  full_name text not null,
  company_name text not null default '',
  company_sector text not null default '',
  cpf_cnpj text not null,
  email text not null,
  commercial_contact text not null,
  current_website_url text,
  is_remote boolean not null default false,
  address_zipcode text,
  address_street text,
  address_number text,
  address_neighborhood text,
  address_city text,
  address_state text,

  -- Steps 04-06: Estrategia e Mercado
  primary_goal text not null default '',
  current_pain_points text[] not null default '{}',
  current_pain_point_other text,
  target_audience_types text[] not null default '{}',
  audience_age_range text[] not null default '{}',
  audience_behavior text[] not null default '{}',
  competitors text,
  competitor_likes text[] not null default '{}',
  unique_value_props text[] not null default '{}',
  unique_value_prop_other text,
  has_social_media boolean not null default false,
  social_media_networks text[] not null default '{}',
  social_media_handles text,

  -- Steps 07-08: Projeto e Escopo
  project_type text not null default '',
  project_goals text[] not null default '{}',
  project_goals_other text,
  needs_cms boolean not null default false,
  needs_contact_form boolean not null default false,
  needs_whatsapp boolean not null default false,
  needs_seo boolean not null default false,
  site_languages text[] not null default '{}',
  analytics_required text[] not null default '{}',
  tracking_pixels text[] not null default '{}',
  project_scope_config jsonb not null default '{}',

  -- Steps 09-10: Design, Branding e Infraestrutura
  branding_status text not null default '',
  design_style text[] not null default '{}',
  brand_voice text[] not null default '{}',
  design_references text,
  has_domain boolean not null default false,
  website_url text,
  has_hosting boolean not null default false,
  hosting_provider text,
  needs_seo_consulting boolean not null default false,
  needs_wcag boolean not null default false,
  needs_post_support boolean not null default false,

  -- Steps 11-12: Cronograma, Budget e Comunicacao
  decision_maker text not null default '',
  has_critical_deadline boolean not null default false,
  critical_deadline_reason text,
  delivery_timeline text not null default '',
  project_budget text not null default '',
  content_status text not null default '',
  preferred_contact text not null default '',
  meeting_frequency text not null default '',

  -- Status e timestamps
  whatsapp_status text not null default 'pending',
  whatsapp_error text,
  submitted_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.onboarding_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.onboarding_submissions(id) on delete cascade,
  category text not null,
  file_name text not null,
  storage_path text not null,
  content_type text not null,
  size_bytes bigint not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists onboarding_files_submission_id_idx
  on public.onboarding_files (submission_id);

create index if not exists onboarding_submissions_submitted_at_idx
  on public.onboarding_submissions (submitted_at desc);

create index if not exists onboarding_submissions_project_type_idx
  on public.onboarding_submissions (project_type);

create index if not exists onboarding_submissions_budget_idx
  on public.onboarding_submissions (project_budget);
