-- =============================================================
-- Migration: saved_spots table
-- Apply via: supabase db push
-- OR paste into Supabase Dashboard → SQL Editor and run
-- =============================================================

CREATE TABLE IF NOT EXISTS public.saved_spots (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lat         double precision NOT NULL,
  lng         double precision NOT NULL,
  type        text NOT NULL DEFAULT 'other',
  name        text NOT NULL,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS saved_spots_user_id_idx ON public.saved_spots(user_id);

-- Enable RLS
ALTER TABLE public.saved_spots ENABLE ROW LEVEL SECURITY;

-- Users can only see their own spots
CREATE POLICY "Users can view own spots"
  ON public.saved_spots FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own spots
CREATE POLICY "Users can insert own spots"
  ON public.saved_spots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own spots
CREATE POLICY "Users can delete own spots"
  ON public.saved_spots FOR DELETE
  USING (auth.uid() = user_id);
