-- ============================================================================
-- HEATSHIELD (TF-141) — SUPABASE POSTGRESQL DATABASE MIGRATION
-- Migration: 20261020000002_heatshield_master.sql
-- Description: Master Environmental Research Dataset (150,000 Records, 2021-2025)
-- Dialect: PostgreSQL 14+ / Supabase Compatible
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. MASTER OBSERVATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.heatshield_master (
    record_id VARCHAR(32) PRIMARY KEY,
    location_id VARCHAR(20) NOT NULL,
    observation_datetime TIMESTAMPTZ NOT NULL,
    observation_date DATE NOT NULL,
    year SMALLINT NOT NULL,
    month SMALLINT NOT NULL,
    day SMALLINT NOT NULL,
    season VARCHAR(20) NOT NULL,
    data_source_type VARCHAR(50) NOT NULL DEFAULT 'Synthetic simulation',
    is_synthetic BOOLEAN NOT NULL DEFAULT TRUE,

    city VARCHAR(50) NOT NULL DEFAULT 'Solapur',
    state VARCHAR(50) NOT NULL DEFAULT 'Maharashtra',
    country VARCHAR(50) NOT NULL DEFAULT 'India',
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    location_name VARCHAR(120) NOT NULL,
    zone_type VARCHAR(40) NOT NULL,
    elevation_m SMALLINT NOT NULL,
    population_density_per_km2 INT NOT NULL,
    distance_to_green_space_m INT NOT NULL,

    air_temperature_c DECIMAL(5, 2) NOT NULL,
    max_air_temperature_c DECIMAL(5, 2) NOT NULL,
    min_air_temperature_c DECIMAL(5, 2) NOT NULL,
    relative_humidity_pct DECIMAL(4, 1) NOT NULL,
    wind_speed_mps DECIMAL(4, 2) NOT NULL,
    wind_direction_deg DECIMAL(4, 1) NOT NULL,
    solar_radiation_w_m2 DECIMAL(6, 1) NOT NULL,
    precipitation_mm DECIMAL(5, 1) NOT NULL,
    cloud_cover_pct DECIMAL(4, 1) NOT NULL,
    atmospheric_pressure_hpa DECIMAL(6, 1) NOT NULL,

    land_surface_temperature_c DECIMAL(5, 2) NOT NULL,
    surface_temperature_anomaly_c DECIMAL(5, 2) NOT NULL,
    ndvi DECIMAL(4, 3) NOT NULL,
    ndbi DECIMAL(4, 3) NOT NULL,
    ndwi DECIMAL(4, 3) NOT NULL,
    vegetation_cover_pct DECIMAL(4, 1) NOT NULL,
    impervious_surface_pct DECIMAL(4, 1) NOT NULL,
    building_density_index DECIMAL(3, 2) NOT NULL,
    road_density_km_per_km2 DECIMAL(4, 1) NOT NULL,
    tree_canopy_cover_pct DECIMAL(4, 1) NOT NULL,
    shade_availability_pct DECIMAL(4, 1) NOT NULL,
    surface_albedo DECIMAL(3, 2) NOT NULL,
    distance_to_water_m INT NOT NULL,

    pedestrian_activity_index DECIMAL(4, 1) NOT NULL,
    traffic_intensity_index DECIMAL(4, 1) NOT NULL,
    built_up_intensity_index DECIMAL(4, 1) NOT NULL,
    heat_exposure_index DECIMAL(4, 1) NOT NULL,
    vulnerable_population_index DECIMAL(4, 1) NOT NULL,
    cooling_infrastructure_present BOOLEAN NOT NULL,
    cooling_infrastructure_type VARCHAR(60) NOT NULL,

    urban_heat_island_intensity_c DECIMAL(4, 2) NOT NULL,
    heat_risk_category VARCHAR(20) NOT NULL,
    shade_gap_index DECIMAL(4, 1) NOT NULL,
    green_cover_deficit_pct DECIMAL(4, 1) NOT NULL,
    cooling_priority_score DECIMAL(4, 1) NOT NULL,
    recommended_intervention VARCHAR(120) NOT NULL,
    estimated_cooling_potential_c DECIMAL(4, 2) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Domain verification constraints
    CONSTRAINT chk_master_rh CHECK (relative_humidity_pct BETWEEN 0 AND 100),
    CONSTRAINT chk_master_cloud CHECK (cloud_cover_pct BETWEEN 0 AND 100),
    CONSTRAINT chk_master_ndvi CHECK (ndvi BETWEEN -1.0 AND 1.0),
    CONSTRAINT chk_master_ndbi CHECK (ndbi BETWEEN -1.0 AND 1.0),
    CONSTRAINT chk_master_ndwi CHECK (ndwi BETWEEN -1.0 AND 1.0),
    CONSTRAINT chk_master_veg CHECK (vegetation_cover_pct BETWEEN 0 AND 100),
    CONSTRAINT chk_master_imp CHECK (impervious_surface_pct BETWEEN 0 AND 100),
    CONSTRAINT chk_master_bldg CHECK (building_density_index BETWEEN 0.0 AND 1.0),
    CONSTRAINT chk_master_albedo CHECK (surface_albedo BETWEEN 0.0 AND 1.0),
    CONSTRAINT chk_master_cps CHECK (cooling_priority_score BETWEEN 0 AND 100),
    CONSTRAINT chk_master_temp_hierarchy CHECK (min_air_temperature_c <= air_temperature_c AND air_temperature_c <= max_air_temperature_c)
);

COMMENT ON TABLE public.heatshield_master IS 'Master Solapur environmental telemetry corpus (150,000 calibrated simulation records, 2021-2025).';

-- ----------------------------------------------------------------------------
-- 2. HIGH PERFORMANCE QUERY INDEXES
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_master_loc_id ON public.heatshield_master(location_id);
CREATE INDEX IF NOT EXISTS idx_master_obs_date ON public.heatshield_master(observation_date);
CREATE INDEX IF NOT EXISTS idx_master_obs_datetime ON public.heatshield_master(observation_datetime DESC);
CREATE INDEX IF NOT EXISTS idx_master_zone ON public.heatshield_master(zone_type);
CREATE INDEX IF NOT EXISTS idx_master_risk ON public.heatshield_master(heat_risk_category);
CREATE INDEX IF NOT EXISTS idx_master_year_month ON public.heatshield_master(year, month);
CREATE INDEX IF NOT EXISTS idx_master_coords ON public.heatshield_master(latitude, longitude);

-- ----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.heatshield_master ENABLE ROW LEVEL SECURITY;

-- Allow public read access to research dataset (anon and authenticated)
DROP POLICY IF EXISTS "heatshield_master_select_public" ON public.heatshield_master;
CREATE POLICY "heatshield_master_select_public"
  ON public.heatshield_master
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Disallow insert/update/delete for public/anon/authenticated roles
-- Only service_role (used by secure local batch import script) can write

-- ----------------------------------------------------------------------------
-- 4. PERMISSIONS & SCHEMA GRANTS
-- ----------------------------------------------------------------------------
GRANT SELECT ON public.heatshield_master TO anon, authenticated;
