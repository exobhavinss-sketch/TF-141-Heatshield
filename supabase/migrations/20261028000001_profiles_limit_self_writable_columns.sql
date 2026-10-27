-- Prevent authenticated users from assigning their own profile role or
-- controlling server-managed timestamps. Existing row ownership RLS remains
-- enabled and unchanged. Apply through the normal Supabase migration process.
BEGIN;

REVOKE INSERT, UPDATE ON TABLE public.profiles FROM authenticated;

GRANT INSERT (id, full_name, avatar_url, affiliation)
  ON TABLE public.profiles TO authenticated;

GRANT UPDATE (full_name, avatar_url, affiliation)
  ON TABLE public.profiles TO authenticated;

COMMIT;
