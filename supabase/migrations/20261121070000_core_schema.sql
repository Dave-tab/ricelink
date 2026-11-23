-- RiceLink | Migration 0001
-- Core production-oriented relational foundation
-- Target: Supabase PostgreSQL
-- IMPORTANT:
--   1. Review this migration before applying it to any environment.
--   2. This migration intentionally enables RLS without adding policies.
--      Until Milestone 2 policies are installed, client access is denied.
--   3. No sample/demo records are inserted here.
--   4. No universal package conversions (e.g. "1 bag = 50 kg") are assumed.

begin;

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Shared timestamp trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Identity and organisation foundation
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (length(btrim(full_name)) between 2 and 160),
  phone_number text,
  avatar_path text,
  account_status text not null default 'active'
    check (account_status in ('active', 'suspended', 'deactivated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 2 and 180),
  slug text not null unique
    check (slug = lower(slug) and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  organization_type text not null
    check (organization_type in (
      'cooperative', 'aggregator', 'processor', 'buyer',
      'storage_provider', 'logistics_provider', 'other'
    )),
  description text,
  registration_number text,
  location_id uuid,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'pending', 'verified', 'rejected', 'suspended')),
  verified_at timestamptz,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  membership_role text not null default 'member'
    check (membership_role in ('owner', 'admin', 'manager', 'member')),
  membership_status text not null default 'active'
    check (membership_status in ('invited', 'active', 'suspended', 'left')),
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_memberships_org_profile_key unique (organization_id, profile_id)
);

create unique index organization_memberships_single_active_owner_idx
  on public.organization_memberships (organization_id)
  where membership_role = 'owner' and membership_status = 'active';

-- Participant capabilities are separate from organization permissions.
-- A person can have several participant roles and can hold different roles
-- personally or within different organizations.
create table public.participant_roles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  role_code text not null
    check (role_code in (
      'producer', 'aggregator', 'processor', 'buyer',
      'storage_provider', 'logistics_operator'
    )),
  created_at timestamptz not null default now()
);

create unique index participant_roles_personal_unique
  on public.participant_roles (profile_id, role_code)
  where organization_id is null;

create unique index participant_roles_org_unique
  on public.participant_roles (profile_id, organization_id, role_code)
  where organization_id is not null;

-- ---------------------------------------------------------------------------
-- Geographic locations
-- ---------------------------------------------------------------------------

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  parent_location_id uuid references public.locations(id) on delete restrict,
  location_type text not null
    check (location_type in ('country', 'state', 'lga', 'town', 'community', 'facility')),
  country_code char(2),
  name text not null check (length(btrim(name)) between 1 and 160),
  code text,
  latitude numeric(9,6) check (latitude between -90 and 90),
  longitude numeric(9,6) check (longitude between -180 and 180),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint locations_country_code_format
    check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  constraint locations_parent_not_self
    check (parent_location_id is null or parent_location_id <> id)
);

create unique index locations_parent_name_type_unique
  on public.locations (coalesce(parent_location_id, '00000000-0000-0000-0000-000000000000'::uuid),
                       lower(name), location_type);

alter table public.organizations
  add constraint organizations_location_fk
  foreign key (location_id) references public.locations(id) on delete set null;

-- ---------------------------------------------------------------------------
-- Multi-crop catalogue
-- ---------------------------------------------------------------------------

create table public.crop_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(btrim(name)) between 2 and 100),
  slug text not null unique
    check (slug = lower(slug) and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.commodities (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.crop_categories(id) on delete restrict,
  name text not null check (length(btrim(name)) between 2 and 120),
  slug text not null unique
    check (slug = lower(slug) and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  commodity_code text unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint commodities_id_category_key unique (id, category_id)
);

create table public.commodity_varieties (
  id uuid primary key default gen_random_uuid(),
  commodity_id uuid not null references public.commodities(id) on delete restrict,
  name text not null check (length(btrim(name)) between 1 and 120),
  code text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint commodity_varieties_commodity_name_key unique (commodity_id, name),
  constraint commodity_varieties_id_commodity_key unique (id, commodity_id)
);

create table public.commodity_grades (
  id uuid primary key default gen_random_uuid(),
  commodity_id uuid not null references public.commodities(id) on delete restrict,
  code text not null,
  label text not null,
  description text,
  specifications jsonb not null default '{}'::jsonb
    check (jsonb_typeof(specifications) = 'object'),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint commodity_grades_commodity_code_key unique (commodity_id, code),
  constraint commodity_grades_id_commodity_key unique (id, commodity_id)
);

-- Crop-specific attributes avoid forcing all crops into the same columns.
create table public.crop_attribute_definitions (
  id uuid primary key default gen_random_uuid(),
  commodity_id uuid not null references public.commodities(id) on delete cascade,
  attribute_key text not null
    check (attribute_key = lower(attribute_key) and attribute_key ~ '^[a-z][a-z0-9_]*$'),
  label text not null,
  data_type text not null
    check (data_type in ('text', 'number', 'boolean', 'date', 'option', 'multi_option')),
  unit_label text,
  is_required_for_supply boolean not null default false,
  is_required_for_procurement boolean not null default false,
  validation_config jsonb not null default '{}'::jsonb
    check (jsonb_typeof(validation_config) = 'object'),
  options jsonb not null default '[]'::jsonb
    check (jsonb_typeof(options) = 'array'),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crop_attribute_definitions_commodity_key unique (commodity_id, attribute_key),
  constraint crop_attribute_definitions_id_commodity_key unique (id, commodity_id)
);

-- ---------------------------------------------------------------------------
-- Units and explicit conversion rules
-- ---------------------------------------------------------------------------

create table public.units_of_measure (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  symbol text not null unique,
  measurement_dimension text not null
    check (measurement_dimension in ('mass', 'volume', 'count', 'area', 'package', 'other')),
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A conversion is only usable when its context is known and approved.
-- Package units such as bag, basket and crate must not receive an assumed
-- global conversion factor.
create table public.unit_conversion_rules (
  id uuid primary key default gen_random_uuid(),
  from_unit_id uuid not null references public.units_of_measure(id) on delete restrict,
  to_unit_id uuid not null references public.units_of_measure(id) on delete restrict,
  commodity_id uuid references public.commodities(id) on delete restrict,
  conversion_factor numeric(24,10) not null check (conversion_factor > 0),
  context_label text not null check (length(btrim(context_label)) between 2 and 180),
  evidence_reference text,
  is_verified boolean not null default false,
  verified_by uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unit_conversion_rules_distinct_units check (from_unit_id <> to_unit_id),
  constraint unit_conversion_rules_verification_consistency
    check (
      is_verified = false
      or (verified_at is not null and verified_by is not null)
    )
);

-- ---------------------------------------------------------------------------
-- Supply and procurement
-- ---------------------------------------------------------------------------

create table public.supply_listings (
  id uuid primary key default gen_random_uuid(),
  listing_code text unique,
  owner_profile_id uuid not null references public.profiles(id) on delete restrict,
  organization_id uuid references public.organizations(id) on delete restrict,
  commodity_id uuid not null references public.commodities(id) on delete restrict,
  variety_id uuid,
  grade_id uuid,
  quantity numeric(24,6) not null check (quantity > 0),
  unit_id uuid not null references public.units_of_measure(id) on delete restrict,
  supply_type text not null default 'available'
    check (supply_type in ('available', 'expected')),
  location_id uuid not null references public.locations(id) on delete restrict,
  available_from date,
  available_until date,
  asking_price_per_unit numeric(24,6) check (asking_price_per_unit is null or asking_price_per_unit >= 0),
  currency_code char(3) not null default 'NGN'
    check (currency_code ~ '^[A-Z]{3}$'),
  description text,
  status text not null default 'draft'
    check (status in (
      'draft', 'published', 'paused', 'partially_allocated',
      'unavailable', 'closed', 'expired'
    )),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint supply_listings_availability_dates
    check (available_until is null or available_from is null or available_until >= available_from),
  constraint supply_listings_variety_commodity_fk
    foreign key (variety_id, commodity_id)
    references public.commodity_varieties(id, commodity_id) on delete restrict,
  constraint supply_listings_grade_commodity_fk
    foreign key (grade_id, commodity_id)
    references public.commodity_grades(id, commodity_id) on delete restrict,
  constraint supply_listings_id_commodity_key unique (id, commodity_id)
);

create table public.supply_attribute_values (
  id uuid primary key default gen_random_uuid(),
  supply_listing_id uuid not null references public.supply_listings(id) on delete cascade,
  commodity_id uuid not null,
  attribute_definition_id uuid not null,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint supply_attribute_values_listing_attribute_key
    unique (supply_listing_id, attribute_definition_id),
  constraint supply_attribute_values_listing_commodity_fk
    foreign key (supply_listing_id, commodity_id)
    references public.supply_listings(id, commodity_id) on delete cascade,
  constraint supply_attribute_values_definition_commodity_fk
    foreign key (attribute_definition_id, commodity_id)
    references public.crop_attribute_definitions(id, commodity_id) on delete restrict
);

create table public.procurement_requests (
  id uuid primary key default gen_random_uuid(),
  request_code text unique,
  owner_profile_id uuid not null references public.profiles(id) on delete restrict,
  organization_id uuid references public.organizations(id) on delete restrict,
  commodity_id uuid not null references public.commodities(id) on delete restrict,
  required_quantity numeric(24,6) not null check (required_quantity > 0),
  unit_id uuid not null references public.units_of_measure(id) on delete restrict,
  delivery_location_id uuid not null references public.locations(id) on delete restrict,
  required_from date,
  required_until date,
  target_price_per_unit numeric(24,6) check (target_price_per_unit is null or target_price_per_unit >= 0),
  currency_code char(3) not null default 'NGN'
    check (currency_code ~ '^[A-Z]{3}$'),
  description text,
  status text not null default 'draft'
    check (status in (
      'draft', 'published', 'paused', 'partially_fulfilled',
      'fulfilled', 'closed', 'expired'
    )),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint procurement_requests_required_dates
    check (required_until is null or required_from is null or required_until >= required_from),
  constraint procurement_requests_id_commodity_key unique (id, commodity_id)
);

create table public.procurement_attribute_values (
  id uuid primary key default gen_random_uuid(),
  procurement_request_id uuid not null references public.procurement_requests(id) on delete cascade,
  commodity_id uuid not null,
  attribute_definition_id uuid not null,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint procurement_attribute_values_request_attribute_key
    unique (procurement_request_id, attribute_definition_id),
  constraint procurement_attribute_values_request_commodity_fk
    foreign key (procurement_request_id, commodity_id)
    references public.procurement_requests(id, commodity_id) on delete cascade,
  constraint procurement_attribute_values_definition_commodity_fk
    foreign key (attribute_definition_id, commodity_id)
    references public.crop_attribute_definitions(id, commodity_id) on delete restrict
);

-- ---------------------------------------------------------------------------
-- Enquiries: relational target references, not a polymorphic target_id.
-- Offers, agreements and full messaging workflows are added in Milestone 6.
-- ---------------------------------------------------------------------------

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  enquiry_code text unique,
  supply_listing_id uuid references public.supply_listings(id) on delete restrict,
  procurement_request_id uuid references public.procurement_requests(id) on delete restrict,
  initiated_by_profile_id uuid not null references public.profiles(id) on delete restrict,
  recipient_profile_id uuid not null references public.profiles(id) on delete restrict,
  initial_message text not null check (length(btrim(initial_message)) between 1 and 5000),
  status text not null default 'new'
    check (status in ('new', 'responded', 'in_discussion', 'closed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint enquiries_exactly_one_target
    check (num_nonnulls(supply_listing_id, procurement_request_id) = 1),
  constraint enquiries_distinct_participants
    check (initiated_by_profile_id <> recipient_profile_id)
);

-- ---------------------------------------------------------------------------
-- Audit foundation. Detailed audit policies/writers are implemented securely
-- in Milestone 2; clients must never be allowed to forge audit events.
-- ---------------------------------------------------------------------------

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id) on delete set null,
  entity_type text not null check (length(btrim(entity_type)) between 1 and 80),
  entity_id uuid,
  action text not null check (length(btrim(action)) between 1 and 100),
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes for common discovery, ownership and coordination queries
-- ---------------------------------------------------------------------------

create index organization_memberships_profile_status_idx
  on public.organization_memberships (profile_id, membership_status);

create index organization_memberships_org_status_idx
  on public.organization_memberships (organization_id, membership_status);

create index participant_roles_profile_idx
  on public.participant_roles (profile_id);

create index locations_parent_idx on public.locations (parent_location_id);
create index commodities_category_active_idx on public.commodities (category_id, is_active);
create index commodity_varieties_commodity_active_idx on public.commodity_varieties (commodity_id, is_active);
create index crop_attribute_definitions_commodity_active_idx
  on public.crop_attribute_definitions (commodity_id, is_active, sort_order);

create index unit_conversion_rules_lookup_idx
  on public.unit_conversion_rules (from_unit_id, to_unit_id, commodity_id)
  where is_active = true and is_verified = true;

create index supply_listings_discovery_idx
  on public.supply_listings (commodity_id, status, location_id, created_at desc);

create index supply_listings_owner_idx
  on public.supply_listings (owner_profile_id, created_at desc);

create index supply_listings_organization_idx
  on public.supply_listings (organization_id, created_at desc)
  where organization_id is not null;

create index procurement_requests_discovery_idx
  on public.procurement_requests (commodity_id, status, delivery_location_id, created_at desc);

create index procurement_requests_owner_idx
  on public.procurement_requests (owner_profile_id, created_at desc);

create index procurement_requests_organization_idx
  on public.procurement_requests (organization_id, created_at desc)
  where organization_id is not null;

create index enquiries_initiator_idx on public.enquiries (initiated_by_profile_id, created_at desc);
create index enquiries_recipient_idx on public.enquiries (recipient_profile_id, status, created_at desc);
create index enquiries_supply_idx on public.enquiries (supply_listing_id) where supply_listing_id is not null;
create index enquiries_procurement_idx on public.enquiries (procurement_request_id) where procurement_request_id is not null;
create index audit_events_entity_idx on public.audit_events (entity_type, entity_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'organizations',
    'organization_memberships',
    'locations',
    'crop_categories',
    'commodities',
    'commodity_varieties',
    'commodity_grades',
    'crop_attribute_definitions',
    'units_of_measure',
    'unit_conversion_rules',
    'supply_listings',
    'supply_attribute_values',
    'procurement_requests',
    'procurement_attribute_values',
    'enquiries'
  ]
  loop
    execute format(
      'create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security: deny-by-default until Milestone 2 policies are applied.
-- This prevents accidental exposure if the project is connected early.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.participant_roles enable row level security;
alter table public.locations enable row level security;
alter table public.crop_categories enable row level security;
alter table public.commodities enable row level security;
alter table public.commodity_varieties enable row level security;
alter table public.commodity_grades enable row level security;
alter table public.crop_attribute_definitions enable row level security;
alter table public.units_of_measure enable row level security;
alter table public.unit_conversion_rules enable row level security;
alter table public.supply_listings enable row level security;
alter table public.supply_attribute_values enable row level security;
alter table public.procurement_requests enable row level security;
alter table public.procurement_attribute_values enable row level security;
alter table public.enquiries enable row level security;
alter table public.audit_events enable row level security;

commit;
