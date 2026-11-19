-- ============================================================================
-- Migration 0002 — Row-Level Security (read isolation)
-- Lock every table (default-deny), then add SELECT policies so each person sees
-- ONLY what they should: a patient their own data, a clinician their assigned
-- cases, an admin everything. Maps to NFR T3 + the Week 4 "each person sees only
-- their own data" requirement.
--
-- Scope of this migration: enable RLS + read (SELECT) rules. Write rules
-- (insert/update) are added per-feature in step 9. The Supabase service-role key
-- BYPASSES RLS, so seeding/admin tooling still works.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helpers — tiny trusted lookups. "security definer" lets them peek at role /
-- case-ownership WITHOUT being blocked by the very locks we're setting (and
-- avoids a policy on profiles having to query profiles recursively).
-- ----------------------------------------------------------------------------
create or replace function public.my_role()
  returns user_role
  language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.can_access_case(c uuid)
  returns boolean
  language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.cases
    where id = c
      and ( patient_id   = auth.uid()        -- it's my case (patient)
         or clinician_id = auth.uid()        -- it's assigned to me (clinician)
         or public.my_role() = 'admin' )     -- or I'm an admin
  )
$$;

-- ----------------------------------------------------------------------------
-- PEOPLE — you may read your own profile; admins read all; a clinician may read
-- the profiles of patients on their assigned cases (least privilege).
-- ----------------------------------------------------------------------------
alter table profiles enable row level security;

create policy "profiles: read own" on profiles
  for select using ( id = auth.uid() );

create policy "profiles: admin reads all" on profiles
  for select using ( public.my_role() = 'admin' );

create policy "profiles: clinician reads their patients" on profiles
  for select using (
    public.my_role() = 'clinician'
    and exists ( select 1 from cases c
                 where c.clinician_id = auth.uid() and c.patient_id = profiles.id )
  );

-- ----------------------------------------------------------------------------
-- SPINE — patient sees own cases; clinician sees assigned; admin sees all.
-- ----------------------------------------------------------------------------
alter table cases enable row level security;

create policy "cases: patient reads own" on cases
  for select using ( patient_id = auth.uid() );

create policy "cases: clinician reads assigned" on cases
  for select using ( clinician_id = auth.uid() );

create policy "cases: admin reads all" on cases
  for select using ( public.my_role() = 'admin' );

-- ----------------------------------------------------------------------------
-- STEPS — access INHERITED through the case (the "walk up the case_id ticket"
-- rule). One identical policy per step table via can_access_case().
-- ----------------------------------------------------------------------------
alter table intakes        enable row level security;
alter table appointments   enable row level security;
alter table consultations  enable row level security;
alter table lab_orders     enable row level security;
alter table plans          enable row level security;
alter table prescriptions  enable row level security;

create policy "intakes: via case"       on intakes       for select using ( public.can_access_case(case_id) );
create policy "appointments: via case"  on appointments  for select using ( public.can_access_case(case_id) );
create policy "consultations: via case" on consultations for select using ( public.can_access_case(case_id) );
create policy "lab_orders: via case"    on lab_orders    for select using ( public.can_access_case(case_id) );
create policy "plans: via case"         on plans         for select using ( public.can_access_case(case_id) );
create policy "prescriptions: via case" on prescriptions for select using ( public.can_access_case(case_id) );

-- plan_items hang off a PLAN, so they reach the case one extra hop (plan -> case)
alter table plan_items enable row level security;
create policy "plan_items: via plan's case" on plan_items
  for select using (
    exists ( select 1 from plans p
             where p.id = plan_items.plan_id and public.can_access_case(p.case_id) )
  );

-- ----------------------------------------------------------------------------
-- CATALOG — products are a shared, non-personal list; any signed-in user reads.
-- ----------------------------------------------------------------------------
alter table products enable row level security;
create policy "products: signed-in read" on products
  for select using ( auth.uid() is not null );

-- ----------------------------------------------------------------------------
-- COMPLIANCE — you read your own consents (or an admin/clinician-on-the-case);
-- the audit log is admin-read-only (kept append-only / immutable at go-live).
-- ----------------------------------------------------------------------------
alter table consents enable row level security;
create policy "consents: own or case access" on consents
  for select using (
    profile_id = auth.uid()
    or public.my_role() = 'admin'
    or ( case_id is not null and public.can_access_case(case_id) )
  );

alter table audit_log enable row level security;
create policy "audit_log: admin reads" on audit_log
  for select using ( public.my_role() = 'admin' );
