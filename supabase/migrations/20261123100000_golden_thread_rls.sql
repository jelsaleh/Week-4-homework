-- ============================================================================
-- Migration 0004 — write-side RLS for the patient golden thread.
-- Migration 0002 gave each table READ rules; these are the matching INSERT
-- rules so a signed-in patient can CREATE their own case and add an intake.
-- `with check` = the condition tested at INSERT time (the mirror of `using`).
-- ============================================================================

-- A patient may create a case for themselves — and only themselves.
create policy "cases: patient inserts own" on cases
  for insert with check ( patient_id = auth.uid() );

-- A patient may add an intake to a case they own (reuses can_access_case()).
create policy "intakes: patient inserts via case" on intakes
  for insert with check ( public.can_access_case(case_id) );
