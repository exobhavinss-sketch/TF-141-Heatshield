# HeatShield (TF-141) — Master CSV Dataset Integration & Import Guide

This document describes the architecture, validation rules, database schema, and operational workflow for importing the 150,000-record master environmental research dataset into the **HeatShield** platform for Solapur, Maharashtra, India.

---

## 1. Dataset Provenance & Overview

- **Source File**: `Heat Shield Master Dataset(2).csv` (also accessible under `Datasets/datasets/Heat Shield Master Dataset.csv`)
- **File Size**: ~62.95 MB (66,009,030 bytes)
- **Total Records**: Exactly **150,000** observation rows (excluding the header row)
- **Total Columns**: **57** physical and environmental parameter columns
- **Temporal Coverage**: 5 Years (`2021-01-01` to `2025-12-31`), 1,500 daily observations per station
- **Geographic Coverage**: 100 distinct microclimate monitoring locations (`SOL-LOC-001` to `SOL-LOC-100`) across Solapur Urban Agglomeration (Latitude: 17.612° N to 17.722° N; Longitude: 75.836° E to 75.962° E)
- **Research Provenance**: Calibrated high-resolution microclimate simulation (WRF-Chem / Urban Canopy Model v4.3 and ERA5-Land boundary reanalysis) calibrated against historical India Meteorological Department (IMD) Solapur surface observations.

---

## 2. Master Dataset Schema (57 Columns)

| Category | Column Names | Data Types & Bounds |
| :--- | :--- | :--- |
| **Identifiers** | `record_id`, `location_id` | `VARCHAR(32)` Primary Key (e.g. `HS-2021-0000001`), `VARCHAR(20)` (e.g. `SOL-LOC-001`) |
| **Temporal** | `observation_datetime`, `observation_date`, `year`, `month`, `day`, `season` | `TIMESTAMPTZ`, `DATE`, `SMALLINT` (2021–2025), `SMALLINT` (1–12), `SMALLINT` (1–31), `VARCHAR(20)` |
| **Provenance** | `data_source_type`, `is_synthetic` | `VARCHAR(50)` ('Synthetic simulation'), `BOOLEAN` (`TRUE`) |
| **Geographic** | `city`, `state`, `country`, `latitude`, `longitude`, `location_name`, `zone_type`, `elevation_m`, `population_density_per_km2`, `distance_to_green_space_m`, `distance_to_water_m` | `VARCHAR`, `DECIMAL(9,6)` (17.50–17.85), `DECIMAL(9,6)` (75.75–76.10), `VARCHAR(120)`, `VARCHAR(40)`, `SMALLINT`, `INT`, `INT` |
| **Atmospheric** | `air_temperature_c`, `max_air_temperature_c`, `min_air_temperature_c`, `relative_humidity_pct`, `wind_speed_mps`, `wind_direction_deg`, `solar_radiation_w_m2`, `precipitation_mm`, `cloud_cover_pct`, `atmospheric_pressure_hpa` | `DECIMAL(5,2)` (19.35°C–46.81°C), `DECIMAL(5,2)`, `DECIMAL(5,2)`, `DECIMAL(4,1)` (0–100%), `DECIMAL(4,2)`, `DECIMAL(4,1)`, `DECIMAL(6,1)`, `DECIMAL(5,1)`, `DECIMAL(4,1)`, `DECIMAL(6,1)` |
| **Surface & Spectral** | `land_surface_temperature_c`, `surface_temperature_anomaly_c`, `ndvi`, `ndbi`, `ndwi`, `vegetation_cover_pct`, `impervious_surface_pct`, `building_density_index`, `road_density_km_per_km2`, `tree_canopy_cover_pct`, `shade_availability_pct`, `surface_albedo` | `DECIMAL(5,2)`, `DECIMAL(5,2)`, `DECIMAL(4,3)` (-1 to 1), `DECIMAL(4,3)`, `DECIMAL(4,3)`, `DECIMAL(4,1)`, `DECIMAL(4,1)`, `DECIMAL(3,2)`, `DECIMAL(4,1)`, `DECIMAL(4,1)`, `DECIMAL(4,1)`, `DECIMAL(3,2)` |
| **Vulnerability & Exposure** | `pedestrian_activity_index`, `traffic_intensity_index`, `built_up_intensity_index`, `heat_exposure_index`, `vulnerable_population_index`, `cooling_infrastructure_present`, `cooling_infrastructure_type` | `DECIMAL(4,1)`, `DECIMAL(4,1)`, `DECIMAL(4,1)`, `DECIMAL(4,1)`, `DECIMAL(4,1)`, `BOOLEAN`, `VARCHAR(60)` |
| **Interventions & Risk** | `urban_heat_island_intensity_c`, `heat_risk_category`, `shade_gap_index`, `green_cover_deficit_pct`, `cooling_priority_score`, `recommended_intervention`, `estimated_cooling_potential_c` | `DECIMAL(4,2)`, `VARCHAR(20)` ('Low', 'Moderate', 'High', 'Extreme'), `DECIMAL(4,1)`, `DECIMAL(4,1)`, `DECIMAL(4,1)` (0–100), `VARCHAR(120)`, `DECIMAL(4,2)` |

---

## 3. Architecture & Security Principles

1. **Frontend Isolation**:
   The ~63 MB master CSV and batch upload scripts reside outside `src/` and are excluded from the Vite build output (`npm run build`). The dataset is never shipped in browser JavaScript chunks.
2. **Privilege Separation (Zero Service-Role Exposure)**:
   - The browser frontend uses only the standard public anonymous key (`VITE_SUPABASE_PUBLISHABLE_KEY`) with read-only Row Level Security (`SELECT`).
   - The `SUPABASE_SERVICE_ROLE_KEY` is **never** committed to version control, never embedded in frontend code, and only passed via local environment variables during administrator-initiated batch execution.
3. **Idempotent Upsert Strategy**:
   Every record possesses a stable, unique surrogate identifier (`record_id`, e.g. `HS-2021-0000001`). Re-running the import uses PostgreSQL `ON CONFLICT (record_id) DO UPDATE` so records are never duplicated.
4. **Data Validation Pipeline**:
   The importer verifies:
   - Solapur spatial bounding box: $17.40^\circ \text{N} \le \text{Lat} \le 17.90^\circ \text{N}$, $75.70^\circ \text{E} \le \text{Lon} \le 76.20^\circ \text{E}$.
   - Temperature consistency: $T_{\min} \le T_{\text{air}} \le T_{\max}$.
   - Physical bounds: Relative humidity between $0\%$ and $100\%$, valid ISO timestamps.

---

## 4. Step-by-Step Import Workflow

### Step 1: Ensure CSV Placement
Place `Heat Shield Master Dataset(2).csv` in the project root directory or under `Datasets/datasets/Heat Shield Master Dataset.csv`.

### Step 2: Apply Supabase Database Migration
If you are initializing a fresh database, execute the migration located at:
`supabase/migrations/20261020000002_heatshield_master.sql`

This creates:
- `public.heatshield_master` table matching the 57 columns with constraints.
- Composite query indexes on `location_id`, `observation_date`, `zone_type`, `heat_risk_category`, and coordinates `(latitude, longitude)`.
- Row Level Security (RLS) policy `heatshield_master_select_public` granting public `SELECT` to `anon` and `authenticated` roles.

### Step 3: Run Validation / Dry-Run (No Database Writes)
Validate the source CSV structure, check for anomalies, and confirm throughput:

```bash
# Node.js Streaming Importer (Dry-Run)
node scripts/importMasterDataset.js --dry-run

# Or test a small 1,000-row sample
node scripts/importMasterDataset.js --dry-run --limit 1000

# Or Python Importer (Dry-Run)
python scripts/import_master_dataset.py --dry-run --limit 1000
```

### Step 4: Configure Local Environment Variable for Live Upload
In your local command prompt or PowerShell session (do NOT commit this key to Git):

**Windows PowerShell:**
```powershell
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-from-supabase-dashboard"
```

**Linux / macOS / Bash:**
```bash
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-from-supabase-dashboard"
```

*(Alternatively, place it in a local gitignored `.env.local` file).*

### Step 5: Execute Batch Upload
Run the streaming importer to batch upload the dataset to Supabase:

```bash
# Upload with default batch size (500 rows per batch)
node scripts/importMasterDataset.js

# Or custom batch size for fast network connections
node scripts/importMasterDataset.js --batch-size 1000

# Or using the Python importer
python scripts/import_master_dataset.py --batch-size 1000
```

---

## 5. Verification & Telemetry Confirmation

After running the import, verify the remote database state:

1. **Row Count Check**:
   ```sql
   SELECT count(*) FROM public.heatshield_master;
   -- Expected Result: 150000
   ```
2. **Distinct Stations**:
   ```sql
   SELECT count(DISTINCT location_id) FROM public.heatshield_master;
   -- Expected Result: 100
   ```
3. **Temporal Bounds**:
   ```sql
   SELECT min(observation_date), max(observation_date) FROM public.heatshield_master;
   -- Expected Result: 2021-01-01 to 2025-12-31
   ```

---

## 6. Frontend Integration Details

The following pages and services seamlessly consume this dataset:

1. **`src/services/masterDataService.js`**:
   - Queries `heatshield_master` with server-side pagination, multi-attribute filtering, sorting, and stats calculation.
   - Automatically falls back to the 100 station coordinates in `src/data/solapurLocations.js` and precomputed trends in `src/data/dashboardData.js` if Supabase is offline or unpopulated.
2. **Interactive Leaflet Map (`src/pages/IndiaHeatMap.jsx`)**:
   - Renders station markers using verified coordinates ($17.61^\circ\text{N} - 17.72^\circ\text{N}, 75.83^\circ\text{E} - 75.96^\circ\text{E}$).
   - Displays real temperature, LST, humidity, NDVI, cooling score, and intervention in interactive popups (`HeatMapPopup.jsx`).
   - Seamlessly switches between India-wide reanalysis grid and Solapur microclimate station grid.
3. **Dashboard (`src/pages/Dashboard.jsx`)**:
   - Displays aggregated metrics (Mean Air Temp, Peak LST, Urban Heat Island Anomaly) computed directly from the 150k dataset across 9 distinct urban zones.
   - Exports CSV with real zone-level summary metrics.
4. **Data Explorer (`src/pages/ExploreData.jsx`)**:
   - High-density query ledger with server-side / dynamic pagination across the dataset.
   - Multi-criteria filters for Zone classification, Heat-Risk tier, and Thermal Envelope slider.
   - Real-time inspection drawer displaying solar irradiance, wind vectors, emissivity, canopy cover, and WRF-Chem provenance.
   - Filter-aware CSV export exporting filtered records matching active search and temperature bounds.
