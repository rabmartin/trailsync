-- =============================================================
-- Migration: fix profiles backfill + user_courses DELETE policy
-- Apply via: supabase db push
-- OR paste into Supabase Dashboard → SQL Editor and run
-- =============================================================

-- ── 1. user_courses: allow users to delete their own rows ─────
-- The reset button silently fails if this policy is missing.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename   = 'user_courses'
      AND policyname  = 'Users can delete own course progress'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Users can delete own course progress"
        ON public.user_courses
        FOR DELETE
        USING (auth.uid() = user_id);
    $policy$;
  END IF;
END;
$$;

-- ── 2. Function: create a profile row on new user signup ───────
-- Falls back to email prefix when no full_name/name in metadata.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, created_at)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'name', ''),
      split_part(NEW.email, '@', 1)
    ),
    NULLIF(NEW.raw_user_meta_data->>'username', ''),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ── 3. Trigger: fires after every INSERT on auth.users ─────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ── 4. Backfill: create profile rows for existing auth users ───
-- Covers users (like Tasha, Gus) who signed up before this trigger existed.
INSERT INTO public.profiles (id, full_name, created_at)
SELECT
  u.id,
  COALESCE(
    NULLIF(u.raw_user_meta_data->>'full_name', ''),
    NULLIF(u.raw_user_meta_data->>'name', ''),
    split_part(u.email, '@', 1)
  ),
  u.created_at
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- ── 5. Patch: fill null names on profiles that already exist ───
-- Users who have a profiles row but full_name IS NULL won't appear
-- in search. Update them with the best available name from auth.users.
UPDATE public.profiles p
SET full_name = COALESCE(
  NULLIF(u.raw_user_meta_data->>'full_name', ''),
  NULLIF(u.raw_user_meta_data->>'name', ''),
  split_part(u.email, '@', 1)
)
FROM auth.users u
WHERE p.id = u.id
  AND p.full_name IS NULL
  AND p.username  IS NULL;
