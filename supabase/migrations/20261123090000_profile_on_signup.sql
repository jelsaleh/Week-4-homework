-- ============================================================================
-- Migration 0003 — auto-create a profile when a new auth user signs up.
-- Supabase Auth creates the login in auth.users; this trigger mirrors it into
-- our profiles table so profiles.id always matches the auth user. It runs as
-- security definer so it can insert past RLS. full_name comes from the sign-up
-- form (passed as user metadata); role defaults to 'patient'.
-- ============================================================================
create or replace function public.handle_new_user()
  returns trigger
  language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'patient'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
