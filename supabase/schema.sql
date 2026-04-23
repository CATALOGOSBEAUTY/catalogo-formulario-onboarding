create extension if not exists "pgcrypto";

create table if not exists public.onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  cpf_cnpj text not null,
  email text not null,
  commercial_contact text not null,
  address_zipcode text not null,
  address_street text not null,
  address_number text not null,
  address_neighborhood text not null,
  scheduling_model text not null,
  cancellation_fine text not null,
  reschedule_details text not null,
  upfront_cost text not null,
  has_domain boolean not null default false,
  website_url text not null,
  hosting_provider text not null,
  whatsapp_status text not null default 'pending',
  whatsapp_error text,
  submitted_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.onboarding_services (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.onboarding_submissions(id) on delete cascade,
  name text not null,
  duration text not null,
  value text not null,
  position integer not null default 0
);

create table if not exists public.onboarding_professionals (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.onboarding_submissions(id) on delete cascade,
  name text not null,
  role text not null,
  service_config text not null,
  position integer not null default 0
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

create index if not exists onboarding_services_submission_id_idx
  on public.onboarding_services (submission_id);

create index if not exists onboarding_professionals_submission_id_idx
  on public.onboarding_professionals (submission_id);

create index if not exists onboarding_files_submission_id_idx
  on public.onboarding_files (submission_id);

create index if not exists onboarding_submissions_submitted_at_idx
  on public.onboarding_submissions (submitted_at desc);
