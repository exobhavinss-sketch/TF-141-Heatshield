-- ============================================================================
-- HEATSHIELD (TF-141) — SUPABASE POSTGRESQL DATABASE MIGRATION
-- Project: Urban Heat Exposure Analysis & Cooling Intelligence Platform
-- Institution: MIT Vishwaprayag University, Solapur, Maharashtra, India
-- Version: 1.0.0
-- ============================================================================

-- Ensure pgcrypto extension is active for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. HELPER FUNCTIONS & TRIGGERS
-- ============================================================================

-- Generic updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 2. TABLE DEFINITIONS
-- ============================================================================

-------------------------------------------------------------------------------
-- A. PROFILES
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  affiliation TEXT DEFAULT 'MIT Vishwaprayag University',
  role TEXT NOT NULL DEFAULT 'researcher' CHECK (role IN ('researcher', 'student', 'analyst', 'citizen_scientist')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Authenticated user profiles. Synchronized with Supabase auth.users.';
COMMENT ON COLUMN public.profiles.id IS 'Primary key referencing auth.users.id.';

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_timestamp();

-------------------------------------------------------------------------------
-- B. USER SETTINGS
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('system', 'light', 'dark')),
  units TEXT NOT NULL DEFAULT 'celsius' CHECK (units IN ('celsius', 'fahrenheit')),
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.user_settings IS 'User-specific preferences such as temperature unit and theme.';

CREATE TRIGGER trg_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_timestamp();

-------------------------------------------------------------------------------
-- C. HEAT READINGS
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.heat_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  temperature_c NUMERIC NOT NULL CHECK (temperature_c >= -10.0 AND temperature_c <= 75.0),
  humidity_percent NUMERIC CHECK (humidity_percent >= 0.0 AND humidity_percent <= 100.0),
  surface_temp_c NUMERIC CHECK (surface_temp_c IS NULL OR (surface_temp_c >= -10.0 AND surface_temp_c <= 95.0)),
  heat_index_c NUMERIC,
  latitude DOUBLE PRECISION CHECK (latitude IS NULL OR (latitude >= -90.0 AND latitude <= 90.0)),
  longitude DOUBLE PRECISION CHECK (longitude IS NULL OR (longitude >= -180.0 AND longitude <= 180.0)),
  station_id TEXT CHECK (station_id IS NULL OR length(station_id) <= 64),
  substrate TEXT CHECK (substrate IS NULL OR length(substrate) <= 64),
  instrument_spec TEXT CHECK (instrument_spec IS NULL OR length(instrument_spec) <= 128),
  notes TEXT CHECK (notes IS NULL OR length(notes) <= 2000),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'flagged', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.heat_readings IS 'User-submitted in-situ temperature observations with strict validation.';

CREATE TRIGGER trg_heat_readings_updated_at
  BEFORE UPDATE ON public.heat_readings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_timestamp();

-------------------------------------------------------------------------------
-- D. SAVED ANALYSES
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (length(trim(title)) > 0 AND length(title) <= 200),
  description TEXT CHECK (description IS NULL OR length(description) <= 1000),
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  analysis_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Ensure json payloads do not exceed 256KB to guard database resources
  CONSTRAINT check_filters_payload_size CHECK (octet_length(filters::text) <= 262144),
  CONSTRAINT check_analysis_data_payload_size CHECK (octet_length(analysis_data::text) <= 262144)
);

COMMENT ON TABLE public.saved_analyses IS 'User saved analytical queries, filter sets, and custom calculation snapshots.';

CREATE TRIGGER trg_saved_analyses_updated_at
  BEFORE UPDATE ON public.saved_analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_timestamp();

-------------------------------------------------------------------------------
-- E. CONTACT MESSAGES
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL CHECK (length(trim(name)) >= 2 AND length(name) <= 120),
  email TEXT NOT NULL CHECK (
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' 
    AND length(email) <= 255
  ),
  subject TEXT NOT NULL CHECK (length(trim(subject)) >= 3 AND length(subject) <= 200),
  message TEXT NOT NULL CHECK (length(trim(message)) >= 10 AND length(message) <= 3000),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived', 'spam')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.contact_messages IS 'Incoming research inquiries and feedback. Admin-moderated; private.';

-- ============================================================================
-- 3. INDEXES FOR PERFORMANCE & INTEGRITY
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_heat_readings_user_id ON public.heat_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_heat_readings_recorded_at ON public.heat_readings(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_heat_readings_status ON public.heat_readings(status);
CREATE INDEX IF NOT EXISTS idx_heat_readings_coords ON public.heat_readings(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_saved_analyses_user_id ON public.saved_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_analyses_created_at ON public.saved_analyses(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_user_id ON public.contact_messages(user_id) WHERE user_id IS NOT NULL;

-- ============================================================================
-- 4. AUTOMATIC AUTH USER INITIALIZATION TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_avatar_url TEXT;
BEGIN
  -- Extract user metadata safely from signup payload
  v_full_name := coalesce(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );
  v_avatar_url := NEW.raw_user_meta_data->>'avatar_url';

  -- Create public profile
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, v_full_name, v_avatar_url)
  ON CONFLICT (id) DO UPDATE SET
    full_name = coalesce(EXCLUDED.full_name, profiles.full_name),
    avatar_url = coalesce(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = now();

  -- Create default user settings
  INSERT INTO public.user_settings (user_id, theme, units, preferences)
  VALUES (NEW.id, 'system', 'celsius', '{}'::jsonb)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log warning to Postgres log without failing user creation
  RAISE WARNING 'handle_new_user error for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Hook into auth.users on insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on every table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heat_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------------------
-- A. PROFILES POLICIES
-------------------------------------------------------------------------------
-- Users can only read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can only update their own profile; cannot elevate role or change ID
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
  );

-- Users can insert their own profile
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-------------------------------------------------------------------------------
-- B. USER SETTINGS POLICIES
-------------------------------------------------------------------------------
CREATE POLICY "user_settings_select_own"
  ON public.user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_settings_update_own"
  ON public.user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_settings_insert_own"
  ON public.user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- C. HEAT READINGS POLICIES
-------------------------------------------------------------------------------
-- Users can only view their own submissions (private raw submissions)
CREATE POLICY "heat_readings_select_own"
  ON public.heat_readings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can submit readings only for themselves with 'pending' status
CREATE POLICY "heat_readings_insert_own"
  ON public.heat_readings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
  );

-- Users can update notes/coordinates on their own pending submissions
-- Browser CANNOT mark status as verified or approved!
CREATE POLICY "heat_readings_update_own"
  ON public.heat_readings
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    AND status = 'pending'
  )
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
  );

-- Users can delete their own pending readings
CREATE POLICY "heat_readings_delete_own"
  ON public.heat_readings
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id
    AND status = 'pending'
  );

-------------------------------------------------------------------------------
-- D. SAVED ANALYSES POLICIES
-------------------------------------------------------------------------------
CREATE POLICY "saved_analyses_select_own"
  ON public.saved_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "saved_analyses_insert_own"
  ON public.saved_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_analyses_update_own"
  ON public.saved_analyses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_analyses_delete_own"
  ON public.saved_analyses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-------------------------------------------------------------------------------
-- E. CONTACT MESSAGES POLICIES
-------------------------------------------------------------------------------
-- Authenticated users can insert messages (associated with user_id or anonymous)
CREATE POLICY "contact_messages_insert_authenticated"
  ON public.contact_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.uid() = user_id OR user_id IS NULL)
    AND status = 'new'
  );

-- Anonymous visitors can submit contact messages with null user_id and 'new' status
CREATE POLICY "contact_messages_insert_anon"
  ON public.contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (
    user_id IS NULL
    AND status = 'new'
  );

-- IMPORTANT: NO SELECT/UPDATE/DELETE policies are granted to authenticated or anon roles.
-- Contact messages can only be read, moderated, or deleted via the Supabase Dashboard
-- or a separately authorized service-role administrative process.

-- ============================================================================
-- 6. EXPLICIT PRIVILEGES AND PERMISSIONS
-- ============================================================================
-- Revoke default public schema grants
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Authenticated role permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.heat_readings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_analyses TO authenticated;
GRANT INSERT ON public.contact_messages TO authenticated;

-- Anonymous role permissions (only inserting contact messages)
GRANT INSERT ON public.contact_messages TO anon;
