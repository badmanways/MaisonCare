-- ==============================================================================
-- NANNY & MAISONCARE LËTZEBUERG — SUPABASE PRODUCTION DATABASE SCHEMA
-- ==============================================================================
-- Paste this script into your Supabase Dashboard -> SQL Editor -> Run

-- 1. Create persistent JSONB storage table for MaisonCare
-- Stores bookings, job applications, job vacancies, client reviews, AI tickets,
-- push notification subscriptions, and admin settings.
CREATE TABLE IF NOT EXISTS public.maisoncare_store (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.maisoncare_store ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow service_role key full read/write access (used by serverless API)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'maisoncare_store' AND policyname = 'Allow service_role full access'
  ) THEN
    CREATE POLICY "Allow service_role full access" ON public.maisoncare_store
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 4. Optional Storage bucket for candidate CV documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT (id) DO NOTHING;

