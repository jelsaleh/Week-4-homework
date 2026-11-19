-- ============================================================================
-- Migration 0001 — initial schema (telehealth MVP #1)
-- Translates the approved ERD into tables. Design phase only: this file is the
-- "recipe". It builds tables when executed against Postgres/Supabase (step 8).
-- Grouped: fixed vocabularies -> people -> spine -> steps -> catalog -> compliance.
-- Maps to docs/build-scope.md §2.1 "Core data model".
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Fixed vocabularies (enums) — a locked menu of allowed values; typos rejected.
-- ----------------------------------------------------------------------------
create type user_role  as enum ('patient', 'clinician', 'admin');
create type case_stage as enum ('intake', 'triage', 'consult', 'labs', 'prescribe', 'complete');

-- ----------------------------------------------------------------------------
-- PEOPLE — one row per person. profile.id IS the Supabase Auth user id, so the
-- profile is tied to a login. full_name is required (medical record must name
-- the person); role defaults to patient (most sign-ups).
-- ----------------------------------------------------------------------------
create table profiles (
  id          uuid        primary key references auth.users(id),
  role        user_role   not null default 'patient',
  full_name   text        not null,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- SPINE — one case = one treatment journey. patient_id required (every case has
-- exactly one patient); clinician_id optional (unassigned until a clinician
-- takes it). stage auto-starts at 'intake'.
-- ----------------------------------------------------------------------------
create table cases (
  id            uuid        primary key default gen_random_uuid(),
  patient_id    uuid        not null references profiles(id),
  clinician_id  uuid        references profiles(id),
  stage         case_stage  not null default 'intake',
  created_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- STEPS — each clips onto the spine with a case_id ticket. No ON DELETE rule:
-- clinical records are retained (legal/regulatory), so by default the database
-- REFUSES to delete a case that still has steps attached.
-- ----------------------------------------------------------------------------
create table intakes (
  id          uuid        primary key default gen_random_uuid(),
  case_id     uuid        not null references cases(id),
  answers     jsonb       not null default '{}',   -- the whole intake form, one flexible bundle
  created_at  timestamptz not null default now()
);

create table appointments (
  id            uuid        primary key default gen_random_uuid(),
  case_id       uuid        not null references cases(id),
  scheduled_at  timestamptz,                         -- when the consult is booked for
  video_link    text,                                -- DHA-compliant provider wired at licensing (build-scope §3)
  created_at    timestamptz not null default now()
);

create table consultations (
  id          uuid        primary key default gen_random_uuid(),
  case_id     uuid        not null references cases(id),
  notes       text,
  outcome     text,
  created_at  timestamptz not null default now()
);

create table lab_orders (
  id          uuid        primary key default gen_random_uuid(),
  case_id     uuid        not null references cases(id),
  status      text        not null default 'ordered',  -- ordered -> resulted -> reviewed
  created_at  timestamptz not null default now()
);

create table plans (
  id          uuid        primary key default gen_random_uuid(),
  case_id     uuid        not null references cases(id),
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- CATALOG — the menu of treatments, each defined once. ede_cleared is the EDE
-- gate (build-scope §2.2): only cleared products may be prescribed.
-- ----------------------------------------------------------------------------
create table products (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  ede_cleared  boolean     not null default false,
  created_at   timestamptz not null default now()
);

-- plan_items — the JOIN TABLE: one row per "this product, on this plan, at this
-- dose". Makes many-products-per-plan possible (the restaurant receipt lines).
create table plan_items (
  id          uuid        primary key default gen_random_uuid(),
  plan_id     uuid        not null references plans(id),
  product_id  uuid        not null references products(id),
  dosage      text,                                  -- plan-specific detail
  created_at  timestamptz not null default now()
);

-- prescriptions — the issued Rx (physician-only; generates the Rx PDF later).
create table prescriptions (
  id          uuid        primary key default gen_random_uuid(),
  case_id     uuid        not null references cases(id),
  product_id  uuid        not null references products(id),
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- COMPLIANCE — consent captured in the flow, and an audit trail of who did what.
-- (build-scope §2.1 "Security & privacy baseline")
-- ----------------------------------------------------------------------------
create table consents (
  id          uuid        primary key default gen_random_uuid(),
  profile_id  uuid        not null references profiles(id),
  case_id     uuid        references cases(id),
  type        text        not null,                  -- e.g. telehealth / privacy / terms
  version     text        not null,                  -- which version they accepted
  created_at  timestamptz not null default now()
);

create table audit_log (
  id          uuid        primary key default gen_random_uuid(),
  profile_id  uuid        references profiles(id),   -- who acted (null = system)
  action      text        not null,                  -- e.g. "viewed case", "wrote prescription"
  created_at  timestamptz not null default now()
);
